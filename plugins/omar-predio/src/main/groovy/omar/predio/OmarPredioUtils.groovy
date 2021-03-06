package omar.predio

import groovy.util.logging.Slf4j
import grails.core.GrailsApplication
import grails.util.Environment

@Slf4j
class OmarPredioUtils
{
   private static ConfigObject predioConfig
   static GrailsApplication application

   /**
    * Parse and load the predio configuration.
    * @return the configuration
    */
   static synchronized ConfigObject getPredioConfig() {
      if (predioConfig == null) {
         log.trace 'Building predio config since there is no cached config'
         reloadPredioConfig()
      }
      predioConfig
   }


   /** Force a reload of the predio  configuration. */
   static void reloadPredioConfig() {
      mergeConfig OmarPredioReflectionUtils.getPredioConfig(), 'DefaultOmarPredioConfig'

      mergeConfigToGlobalConfig()

      log.trace 'reloaded predio config'
   }
   /** Reset the config for testing or after a dev mode Config.groovy change. */
   static synchronized void resetPredioConfig() {
      predioConfig = null
      log.trace 'reset predio config'
   }

   static void mergeConfigToGlobalConfig(){

      log.trace "mergeConfigToGlobalConfig(): Entered..............."

      // I might need to bridge some items to the quarts config variables
      // will leave these here for reference that I cut and past from our other
      // plugin
      //
      application.config.quartz.autoStartup = true
      application.config.quartz.jdbcStore   = false
      application.config.quartz.sessionRequired = true
      log.trace "mergeConfigToGlobalConfig(): Leaving..............."

//      mergeConfig this.securityConfig.spring,  application?.config.grails.plugin.springsecurity
//      mergeConfig this.securityConfig.spring,  SpringSecurityUtils.securityConfig
   }
   /**
    * Merge in a secondary config (provided by a plugin as defaults) into the main config.
    * @param currentConfig the current configuration
    * @param className the name of the config class to load
    */
   private static void mergeConfig(ConfigObject currentConfig, String className) {
      ConfigObject secondary = new ConfigSlurper(Environment.current.name).parse(
              new GroovyClassLoader(this.classLoader).loadClass(className))

      predioConfig = OmarPredioReflectionUtils.predioConfig = mergeConfig(currentConfig, secondary.predio as ConfigObject)
   }

   /**
    * Merge two configs together. The order is important if <code>secondary</code> is not null then
    * start with that and merge the main config on top of that. This lets the <code>secondary</code>
    * config act as default values but let user-supplied values in the main config override them.
    *
    * @param currentConfig the main config, starting from Config.groovy
    * @param secondary new default values
    * @return the merged configs
    */
   private static ConfigObject mergeConfig(ConfigObject currentConfig, ConfigObject secondary) {
      (secondary ?: new ConfigObject()).merge(currentConfig ?: new ConfigObject()) as ConfigObject
   }

   private static def mergeConfig(java.util.Map currentConfig, def grailsConfig)
   {
      currentConfig.keySet().each{key->
         grailsConfig."${key}" = currentConfig."${key}"
      }
      grailsConfig
   }
}
