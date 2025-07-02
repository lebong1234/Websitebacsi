// Middleware/RequestLogging/RequestLoggingMiddleware.cs
using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            await _next(context);
            stopwatch.Stop();
            
            var statusCode = context.Response?.StatusCode;
            var level = statusCode > 499 ? LogLevel.Error : LogLevel.Information;
            
            _logger.Log(level, $"HTTP {context.Request.Method} {context.Request.Path} responded {statusCode} in {stopwatch.Elapsed.TotalMilliseconds}ms");
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, $"HTTP {context.Request.Method} {context.Request.Path} threw exception: {ex.Message}");
            throw;
        }
    }
}