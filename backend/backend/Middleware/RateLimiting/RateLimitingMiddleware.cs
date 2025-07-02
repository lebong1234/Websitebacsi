// Middleware/RateLimiting/RateLimitingMiddleware.cs
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly ConcurrentDictionary<string, DateTime> _requestTracker = new ConcurrentDictionary<string, DateTime>();
    private readonly int _requestLimit = 5; // 5 requests
    private readonly TimeSpan _timeWindow = TimeSpan.FromMinutes(1); // per minute

    public RateLimitingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var ipAddress = context.Connection.RemoteIpAddress?.ToString();

        if (ipAddress != null)
        {
            if (_requestTracker.TryGetValue(ipAddress, out var lastRequestTime))
            {
                if (DateTime.UtcNow - lastRequestTime < _timeWindow)
                {
                    _requestTracker[ipAddress] = DateTime.UtcNow;
                    
                    if (_requestTracker.Count(req => req.Key == ipAddress && 
                        DateTime.UtcNow - req.Value < _timeWindow) > _requestLimit)
                    {
                        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                        await context.Response.WriteAsync("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
                        return;
                    }
                }
                else
                {
                    _requestTracker.TryRemove(ipAddress, out _);
                }
            }

            _requestTracker.TryAdd(ipAddress, DateTime.UtcNow);
        }

        await _next(context);
    }
}