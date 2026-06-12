using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HelperC.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompilerController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public CompilerController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public class CompilerRequest
        {
            public string Code { get; set; } = string.Empty;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunCode([FromBody] CompilerRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return BadRequest(new { error = "Код не може бути порожнім." });
            }

            try
            {
                // 1. Create runner on Paiza.io
                var createContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("source_code", request.Code),
                    new KeyValuePair<string, string>("language", "csharp"),
                    new KeyValuePair<string, string>("api_key", "guest")
                });

                var createResponse = await _httpClient.PostAsync("https://api.paiza.io/runners/create", createContent);
                if (!createResponse.IsSuccessStatusCode)
                {
                    return StatusCode(500, new { error = "Помилка при зв'язку з компілятором (create)." });
                }

                var createResultStr = await createResponse.Content.ReadAsStringAsync();
                var createResult = JsonSerializer.Deserialize<JsonElement>(createResultStr);
                string runId = createResult.GetProperty("id").GetString()!;

                // 2. Poll for results
                string status = "running";
                JsonElement details = default;

                for (int i = 0; i < 15; i++) // max 15 attempts (approx 15 seconds)
                {
                    await Task.Delay(1000);

                    var detailsResponse = await _httpClient.GetAsync($"https://api.paiza.io/runners/get_details?id={runId}&api_key=guest");
                    if (detailsResponse.IsSuccessStatusCode)
                    {
                        var detailsStr = await detailsResponse.Content.ReadAsStringAsync();
                        details = JsonSerializer.Deserialize<JsonElement>(detailsStr);
                        status = details.GetProperty("status").GetString()!;

                        if (status == "completed")
                        {
                            break;
                        }
                    }
                }

                if (status != "completed")
                {
                    return StatusCode(500, new { error = "Час очікування виконання коду вийшов (Timeout)." });
                }

                // Parse output
                string stdout = details.TryGetProperty("stdout", out var o1) && o1.ValueKind == JsonValueKind.String ? o1.GetString()! : "";
                string stderr = details.TryGetProperty("stderr", out var o2) && o2.ValueKind == JsonValueKind.String ? o2.GetString()! : "";
                string buildStderr = details.TryGetProperty("build_stderr", out var o3) && o3.ValueKind == JsonValueKind.String ? o3.GetString()! : "";

                return Ok(new
                {
                    stdout,
                    stderr,
                    buildStderr
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Внутрішня помилка сервера при виконанні коду.", details = ex.Message });
            }
        }
    }
}
