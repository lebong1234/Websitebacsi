﻿// Program.cs
using backend.Data;
using backend.Helper;
using backend.Models.Entities;
using backend.Models.Entities.Doctor;
using backend.Services;
using backend.Services.Booking;
using backend.Services.Patient;
using backend.Services.UploadFile;
using backend.Services.User;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.IO;
using backend.Services.GoogleAuth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Net.payOS;


// using backend.Services.GoogleAuth;


using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// === 1. Đọc và Cấu hình Settings ===
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
var mongoDbSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();

if (mongoDbSettings == null || string.IsNullOrEmpty(mongoDbSettings.ConnectionString) || string.IsNullOrEmpty(mongoDbSettings.DatabaseName))
{
    throw new InvalidOperationException("MongoDbSettings configuration section is missing or invalid. Ensure ConnectionString and DatabaseName are set.");
}
// builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("GoogleAuthSettings"));

// === 2. Đăng ký Services với Dependency Injection ===
// Đăng ký MongoClient như một Singleton
builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoDbSettings.ConnectionString));
// builder.Services.Configure<backend.Services.GoogleAuth.GoogleAuthSettings>(builder.Configuration.GetSection("GoogleAuth"));

// builder.Services.AddSingleton<backend.Services.GoogleAuth.IGoogleUserService, backend.Services.GoogleAuth.GoogleUserService>();
// builder.Services.AddSingleton<backend.Services.GoogleAuth.IGoogleAuthService, backend.Services.GoogleAuth.GoogleAuthService>();
// Đăng ký IMongoDatabase (Scoped)

// Đăng ký PayOS an toàn, kiểm tra null config
builder.Services.AddSingleton<PayOS>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    string clientId = configuration["PayOS:ClientId"];
    string apiKey = configuration["PayOS:ApiKey"];
    string checksumKey = configuration["PayOS:ChecksumKey"];
    if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(checksumKey))
        throw new InvalidOperationException("PayOS config missing in appsettings. Please check PayOS:ClientId, ApiKey, ChecksumKey.");
    return new PayOS(clientId, apiKey, checksumKey);
});

builder.Services.AddScoped<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoDbSettings.DatabaseName);
});

builder.Services.AddScoped<IMongoCollection<User>>(serviceProvider =>
{
    var database = serviceProvider.GetRequiredService<IMongoDatabase>();
    // Chỗ này có thể là vấn đề nếu mongoDbSettings.Collections là null
    // hoặc mongoDbSettings.Collections.Users là null hoặc rỗng
    return database.GetCollection<User>(mongoDbSettings.Collections.Users);
});

// Đăng ký MongoDbContext (nếu bạn sử dụng nó để quản lý các collections)
builder.Services.AddScoped<MongoDbContext>();

// Đăng ký các Application Services (ưu tiên đăng ký interface trỏ đến implementation)
builder.Services.AddScoped<IUploadFileService, UploadFileService>();
builder.Services.AddScoped<IBcryptHelper, BcryptHelper>();
// builder.Services.AddScoped<IGoogleUserService, GoogleUserService>();

// --- User related services ---
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ConfirmAppointmentService>();

// --- Doctor related services ---
builder.Services.AddScoped<IDoctorService, DoctorService>(); // ✅ Controller sẽ inject IDoctorService
builder.Services.AddScoped<IDoctorDetailService, DoctorDetailService>(); // ✅ Controller sẽ inject IDoctorDetailService
builder.Services.AddScoped<DoctorService>();
// Đăng ký DoctorScheduleService trực tiếp nếu không có interface và được inject như class
// Hoặc nếu có interface IDoctorScheduleService: builder.Services.AddScoped<IDoctorScheduleService, DoctorScheduleService>();
builder.Services.AddScoped<DoctorScheduleService>();
builder.Services.AddScoped<DoctorDetailService>();

// --- Booking related services ---
// Giả sử ConfirmAppointmentService không có interface và được inject trực tiếp
// Hoặc nếu có interface IConfirmAppointmentService: builder.Services.AddScoped<IConfirmAppointmentService, ConfirmAppointmentService>();
builder.Services.AddScoped<ConfirmAppointmentService>();

// --- Other entity services ---
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<ISpecialtyService, SpecialtyService>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<UserGGService>();

builder.Services.AddScoped<IEmailService, EmailService>();
// builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();

// === 3. Cấu hình Controllers và Views ===
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

// Authentication: JWT + Cookies + Google OAuth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "your_issuer",
        ValidAudience = "your_audience",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key"))
    };
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration["Google:ClientId"];
    options.ClientSecret = builder.Configuration["Google:ClientSecret"];
    options.CallbackPath = "/signin-google";
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireRole("Admin"));
});

// === 5. Cấu hình CORS ===

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                    "http://localhost:5173", // React dev server (nếu có)
                    "http://localhost"       // Cho phép các port khác của Flutter khi debug
                 )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Nếu frontend gửi credentials (cookies)
    });
});



// === 6. Cấu hình Kestrel ===
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // serverOptions.ListenLocalhost(2000);
    serverOptions.ListenAnyIP(2000);
});

// === 7. Cấu hình Swagger/OpenAPI ===
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My Clinic API",
        Version = "v1",
        Description = "API for Clinic Management Application",
        Contact = new OpenApiContact { Name = "Your Name", Email = "your.email@example.com" }
    });
    // Nếu không có file XML doc, không cần IncludeXmlComments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
    c.CustomSchemaIds(type => type.FullName);
});

// === Đảm bảo thư mục uploads tồn tại trước khi Build() ===
// Điều này giúp tránh lỗi DirectoryNotFoundException khi PhysicalFileProvider khởi tạo
string uploadsFolderPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsFolderPath))
{
    try
    {
        Directory.CreateDirectory(uploadsFolderPath);
        Console.WriteLine($"[INFO] Created directory: {uploadsFolderPath}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Failed to create directory {uploadsFolderPath}: {ex.Message}");
        // Bạn có thể quyết định throw exception ở đây nếu việc tạo thư mục là bắt buộc
        // throw;
    }
}
// =========================================================

var app = builder.Build();

// ==================================================================================
// === 8. Cấu hình HTTP Request Pipeline (Middleware) ===
// ==================================================================================

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My Clinic API V1");
        c.RoutePrefix = string.Empty;
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// HTTPS Redirection (nếu bạn có chứng chỉ SSL cho localhost hoặc production)
// app.UseHttpsRedirection(); // Bỏ comment nếu cần

// --- Cấu hình Static Files ---
// Phục vụ file từ wwwroot (nếu có)
app.UseStaticFiles();

// Phục vụ file từ thư mục "uploads"
// Kiểm tra lại sự tồn tại của thư mục trước khi cấu hình FileProvider
// Mặc dù đã cố gắng tạo ở trên, nhưng kiểm tra lại cũng không thừa
if (Directory.Exists(uploadsFolderPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(uploadsFolderPath),
        RequestPath = "/uploads"
    });
    Console.WriteLine($"[INFO] Serving static files from: {uploadsFolderPath} at /uploads");
}
else
{
    Console.WriteLine($"[WARNING] Directory not found, not serving static files from: {uploadsFolderPath}");
}


app.UseRouting();

// --- Áp dụng CORS Policy ---
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// --- Map Endpoints ---
app.MapControllerRoute(
    name: "admin-statistics",
    pattern: "Admin/Statistics",
    defaults: new { controller = "Admin", action = "Statistics" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

public class PayOSSettings
{
    public string? ClientId { get; set; }
    public string? ApiKey { get; set; }
    public string? ChecksumKey { get; set; }
}