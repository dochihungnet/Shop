# Shop
## Backend: 
+ WebApi ASP.NET Framework 4.8
+ EntityFramework
+ Identity 
### Design pattern [Three-layer architecture application](https://enlabsoftware.com/development/how-to-build-and-deploy-a-three-layer-architecture-application-with-c-sharp-net-in-practice.html?fbclid=IwAR0K2dabM_R7m8xHqMoydl3iLoegusba7yxoE5bHBTyK4vOnNRak3EXtYZ0)
  - Shop.Model
    - Tập hợp các model
  - Shop.Data
    - Infrastructure
    - Migrations
      - Lưu lại các phiên bản database
    - Repositories
    - ShopDbContext.cs
      - Kết nối với database
  - Shop.Service
    - ....Servise
      - Xử lý logic
  - Shop.Api
    - ...Controller
      - Viết api
      
      
## Fontend: Angularjs
### Client
#### Trang chủ
+ Hiển thị được các sản phẩm đang giảm giá
+ Hiển thị được top 3 danh mục sản phẩm bán chạy nhất (dựa vào số lượng bán của mỗi sản phẩm thuộc danh mục)
+ Hiển thị được sản phẩm top (dựa vào số lượng bán nhiều nhất), new (ngày tạo), đánh giá tốt
+ Menu đa cấp (2 cấp), nhiều hơn cũng xử lý được
#### Đăng nhập, đăng xuất
#### Liên hệ
#### Trang sản phẩm theo danh mục sản phẩm
+ Phân trang
+ Tìm kiếm theo keyword, danh mục con, thương hiệu, phạm vi giá tiền
+ Sắp xếp theo giá, tên
#### Giỏ hàng
+ Người dùng chưa đăng nhập thì lưu giỏ hàng xuống local
+ Người dùng đăng nhập thì lưu giỏ hàng xuống loacal, và gửi request server lưu cart vào database
+ Thêm, sửa, xóa giỏ hàng
#### Thanh toán
+ Thanh toán
#### Trang cá nhân (yêu cầu phải đăng nhập mới có)
+ Đổi mật khẩu
+ Thống kê danh sách đơn hàng
+ Thống kế danh sách đơn hàng đang chờ duyệt, đã duyệt, đang giao hàng, đã nhận
### Admin
#### Quản lí slide
#### Quản lí thương hiệu
#### Quản lí sản phẩm
+ Thêm, sửa, xóa, xóa nhiều ... sản phẩm
+ Thêm sửa xóa tình trạng giảm giá mỗi sản phẩm
+ Tìm kiếm theo từ khóa, danh mục, thương hiệu
+ Phân trang
+ Xem chi tiết sản phẩm
#### Quản lí đơn hàng
+ Đơn hàng
+ Đơn hàng đang chờ duyệt
+ Đơn hàng đã duyệt
+ Đơn hàng đang giao
+ Đơn hàng đã nhận + thanh toán
#### Quản lí người dùng
#### Phân quyền
#### SignalR
+ Khi người dùng checkout sẽ bắn 1 thông báo đặt hàng sang admin
