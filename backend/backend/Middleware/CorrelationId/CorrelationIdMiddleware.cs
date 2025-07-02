// Middleware/CorrelationId/CorrelationIdMiddleware.cs
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string CorrelationIdHeader = "X-Correlation-ID";

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        // Try to get correlation ID from header
        if (!context.Request.Headers.TryGetValue(CorrelationIdHeader, out var correlationId))
        {
            // If not present, generate a new one
            correlationId = Guid.NewGuid().ToString();
        }

        // Add correlation ID to response headers
        context.Response.Headers[CorrelationIdHeader] = correlationId;

        // Store correlation ID in HttpContext for downstream use
        context.Items[CorrelationIdHeader] = correlationId.ToString();

        await _next(context);
    }
}