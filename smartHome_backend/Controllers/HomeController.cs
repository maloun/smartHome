using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using  smartHome_backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using JWTRefreshToken.NET6._0.Auth;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System;
using Newtonsoft.Json.Linq;
using SkiaSharp;
using System.Drawing;
using Mysqlx.Crud;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Reflection;
using System.Runtime.ConstrainedExecution;
using System.Net.WebSockets;

namespace smartHome_backend.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> Index(){
            //Include API if excists...
            return Ok(new{
                WaterSpend = 124.4,
                WaterPayed = true,
                WaterSended = true,
                ElectricitySpend = 432.123,
                ElectricityPayed=true,
                ElectricitySended = true
                });
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Dimmer([FromBody] InputDevice data){
            string userToken = _configuration.GetValue<string>("ConnectionCredentials:Token");
            string api = _configuration.GetValue<string>("ConnectionCredentials:Api");
            string apiJoined = api+"?token="+userToken+"&serialnumber="+data.Device;
            bool isOn = false;
            string time = "";
            using (HttpClient client = new HttpClient())
            {
                using (var content = new MultipartFormDataContent())
                {
                    var requestUri = new Uri(apiJoined);
                    var result = await client.PostAsync(requestUri,content);
                    if (result.IsSuccessStatusCode){
                        foreach (var value in ParseAndTransform(result.Content.ReadAsStringAsync().Result))
                        {
                            if(value.Key == "lamp_a1")
                            {
                                isOn = value.Value.ToString()=="1";
                            }

                            if (value.Key == "pir-time"){
                                var timeVal = 0;
                                Int32.TryParse(value.Value.ToString(), out timeVal);
                                time = DateTime.Now.AddSeconds(timeVal).ToString("dd.MM HH:mm");
                            }
                        }
                    }
                }
            }
            return Ok(new{isOn=isOn,time=time});
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DimmerOn([FromBody] InputDevice data){
            string userToken = _configuration.GetValue<string>("ConnectionCredentials:Token");
            string api = _configuration.GetValue<string>("ConnectionCredentials:ApiSend");
            string apiJoined = api+"?token="+userToken+"&serialnumber="+data.Device+"&signal=lamp_a1&state=1";
            using (HttpClient client = new HttpClient())
            {
                using (var content = new MultipartFormDataContent())
                    {
                    var requestUri = new Uri(apiJoined);
                    var result = await client.PostAsync(requestUri,content);
                    }
                
            }
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DimmerOff( InputDevice data){
            string userToken = _configuration.GetValue<string>("ConnectionCredentials:Token");
            string api = _configuration.GetValue<string>("ConnectionCredentials:ApiSend");
            string apiJoined = api+"?token="+userToken+"&serialnumber="+data.Device+"&signal=lamp_a1&state=0";
            using (HttpClient client = new HttpClient())
            {
                using (var content = new MultipartFormDataContent())
                    {
                    var requestUri = new Uri(apiJoined);
                    var result = await client.PostAsync(requestUri,content);
                    }
                
            }
            return Ok(api);
        }

 
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Termostat([FromBody] InputDevice data){
            string userToken = _configuration.GetValue<string>("ConnectionCredentials:Token");
            string api = _configuration.GetValue<string>("ConnectionCredentials:Api");
            string apiJoined = api+"?token="+userToken+"&serialnumber="+data.Device;
            string pressure = "";
            string temperature = "";
            string co2 = "";
            string moisture = "";
            string minTemperature = "";
            string time ="";
            using (HttpClient client = new HttpClient())
            {
                using (var content = new MultipartFormDataContent())
                {
                    var requestUri = new Uri(apiJoined);
                    var result = await client.PostAsync(requestUri,content);
                    if (result.IsSuccessStatusCode){
                        foreach (var value in ParseAndTransform(result.Content.ReadAsStringAsync().Result))
                        {
                            if(value.Key == "co2")
                            {
                                co2 = value.Value.ToString();
                            }
                            if(value.Key == "air-pressure")
                            {
                                pressure = value.Value.ToString();
                            }
                            if(value.Key == "tmn2")
                            {
                                minTemperature = value.Value.ToString();
                            }
                            if(value.Key == "term")
                            {
                                temperature = value.Value.ToString();
                            }
                            if(value.Key == "hum")
                            {
                                moisture = value.Value.ToString();
                            }
                            if (value.Key == "pir-time"){
                                var timeVal = 0;
                                Int32.TryParse(value.Value.ToString(), out timeVal);
                                time = DateTime.Now.AddSeconds(timeVal).ToString("HH:mm");
                            }
                        }
                    }
                }
            }
            return Ok(new{temperature=temperature,minTemperature=minTemperature,moisture=moisture,pressure=pressure,co2=co2,time=time});
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> Devices(){
            string userToken = _configuration.GetValue<string>("ConnectionCredentials:Token");
            bool isOn = false;
            var output = new List<MyDeviceInfo>();
            using (HttpClient client = new HttpClient())
            {
                using (var content = new MultipartFormDataContent())
                {
                    content.Add(new StringContent(userToken), "token");
                    var requestUri = new Uri(_configuration.GetValue<string>("ConnectionCredentials:ApiDevices"));
                    var request = new HttpRequestMessage(HttpMethod.Post, requestUri) { Content = content };
                    var result = await client.PostAsync(requestUri, content);
                    if (result.IsSuccessStatusCode){
                        output = ParseForDevices(result.Content.ReadAsStringAsync().Result);
                    }
                }
            }
            return Ok(output);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> Test(){
            string userToken = _configuration.GetValue<string>("ConnectionCredentials:Token");
            string device = _configuration.GetValue<string>("ConnectionCredentials:Termostat");
            string apiJoined = "https://api-uae-test.ujin.tech/api/devices/get-device-info/?token="+userToken+"&serialnumber="+device;
            bool isOn = false;
            JObject output = new JObject();
            using (HttpClient client = new HttpClient())
            {
                using (var content = new MultipartFormDataContent())
                {
                    var requestUri = new Uri(apiJoined);
                    var result = await client.PostAsync(requestUri,content);
                    if (result.IsSuccessStatusCode){
                        output = ParseAndTransform(result.Content.ReadAsStringAsync().Result);
                        foreach (var value in output)
                        {
                            if(value.Key == "lamp_a1")
                            {
                                isOn = value.Value.ToString()=="1";
                            }
                        }
                    }
                }
            }
            return Ok(output);
        }

        private JObject ParseAndTransform(string input){
            JObject jsonResult = JObject.Parse(input);
            var output = "{ ";
            foreach (var x in jsonResult)
            {
                if (x.Key == "data"){
                    JObject data = JObject.Parse(x.Value.ToString());
                    foreach (var y in data)
                    {
                        if (y.Key == "signals")
                        {
                            dynamic parsedJSON = JValue.Parse(y.Value.ToString());
                            foreach (dynamic questions in parsedJSON)
                            {
                                JObject signal = JObject.Parse(questions.ToString());
                                foreach(var info in signal)
                                {
                                    if (info.Key == "name"){
                                        output += "\""+ info.Value.ToString() + "\" :  \"";
                                    }
                                    if (info.Key == "state"){
                                        JObject subInfo = JObject.Parse(info.Value.ToString());
                                        foreach(var state in subInfo)
                                        {
                                            if(state.Key=="value")
                                            {
                                                output += state.Value.ToString() + "\", ";
                                            }
                                        }
                                    }      
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            return JObject.Parse(output+" }");
        }
        private List<MyDeviceInfo> ParseForDevices(string input){
            JObject jsonResult = JObject.Parse(input);
            var output = new List<MyDeviceInfo>();
            foreach (var x in jsonResult)
            {
                if (x.Key == "data"){
                    JObject data = JObject.Parse(x.Value.ToString());
                    foreach (var y in data)
                    {
                        if (y.Key == "devices")
                        {
                            dynamic parsedJSON = JValue.Parse(y.Value.ToString());
                            foreach (dynamic list in parsedJSON)
                            {
                                JObject listlist = JObject.Parse(list.ToString());
                                foreach(var sublist in listlist)
                                {
                                    if (sublist.Key == "data")
                                    {
                                        dynamic parsedDevicesJSON = JValue.Parse(sublist.Value.ToString());
                                        foreach (dynamic device in parsedDevicesJSON)
                                        {
                                            JObject deviceObj = JObject.Parse(device.ToString());
                                            var id = "";
                                            var type = "";
                                            var name = "";
                                            foreach(var info in deviceObj)
                                            {

                                                if (info.Key == "id")
                                                {
                                                    id = info.Value.ToString();
                                                }
                                                if (info.Key == "signal")
                                                {
                                                    type = info.Value.ToString();
                                                }
                                                if (info.Key == "name")
                                                {
                                                    name = info.Value.ToString();
                                                }
                                            }
                                            MyDeviceInfo deviceElement = new MyDeviceInfo
                                            {
                                                Id=id,
                                                Type=type,
                                                Name=name
                                            };
                                            output.Add(deviceElement);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            return output;
        }
    }
}
