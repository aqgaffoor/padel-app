using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelApi.Data;
using PadelApi.Models;

namespace PadelApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly PadelDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrdersController(PadelDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public class OrderRequestDto
        {
            public List<OrderItemDto> Items { get; set; } = new();
        }

        public class OrderItemDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Customer,Admin")]
        public async Task<IActionResult> CreateOrder(OrderRequestDto request)
        {
            if (request.Items == null || !request.Items.Any())
                return BadRequest("Order must contain items.");

            var user = await _userManager.FindByNameAsync(User.Identity!.Name!);
            if (user == null) return Unauthorized();

            var order = new Order
            {
                UserId = user.Id,
                OrderDate = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            decimal totalAmount = 0;

            foreach (var itemDto in request.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null) return BadRequest($"Product with ID {itemDto.ProductId} not found.");
                if (product.StockQuantity < itemDto.Quantity) return BadRequest($"Not enough stock for product {product.Name}.");

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                order.OrderItems.Add(orderItem);
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;
                product.StockQuantity -= itemDto.Quantity;
            }

            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Return a DTO instead of full order to avoid circular references and exposing sensitive data
            return Ok(new { order.Id, order.OrderDate, order.TotalAmount });
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var user = await _userManager.FindByNameAsync(User.Identity!.Name!);
            if (user == null) return Unauthorized();

            var orders = await _context.Orders
                .Where(o => o.UserId == user.Id)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    Items = o.OrderItems.Select(oi => new { oi.Product!.Name, oi.Quantity, oi.UnitPrice })
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}
