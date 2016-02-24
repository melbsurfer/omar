predio{
   index{
      enabled = true
      dateField = "acquisition_date"
      idField = "id"
      expireDuration = "P3D"
      // polling interval in milliseconds
      pollingInterval = 4000
      predioUrl = ""
      wfs{
         baseUrl = ""
         params = [SERVICE:"WFS", VERSION:"1.0.0", REQUEST:"GetFeature", typeName:"omar:raster_entry"]
      }
      fields = [
         categories: ["mission_id", "image_category", "product_id"],
         locations: ["country_code", "be_number"]
      ]
   }
}