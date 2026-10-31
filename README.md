# PitchPro — Tài liệu yêu cầu và thiết kế hệ thống

- **Phiên bản:** 1.3 — bổ sung chuẩn hóa hệ thống thiết kế giao diện (Design System & UI Vibe).
- **Ngày cập nhật:** 31/10/2026.
- **Sản phẩm:** Ứng dụng web quản lý đội bóng, cầu thủ, đội hình, trận đấu và lịch tập.
- **Đối tượng sử dụng tài liệu:** Nhóm phát triển, kiểm thử, huấn luyện viên và người quản lý đội bóng.
- **Trạng thái:** Đặc tả đề xuất để triển khai; chưa phải biên bản xác nhận yêu cầu của khách hàng.

> Các chức năng và công nghệ chính được giữ từ bản gốc. Phạm vi một đội bóng, thể thức 11 người, cách phân quyền, giới hạn dữ liệu và chỉ tiêu nghiệm thu bên dưới là các mặc định đề xuất. Nhóm có thể dùng để triển khai bản đầu tiên và điều chỉnh khi có yêu cầu thực tế. Tài liệu không khẳng định hệ thống đã được xây dựng hoặc kiểm thử.

## Mục lục

1. Mục tiêu và phạm vi
2. Tác nhân và phân quyền
3. Công nghệ và kiến trúc
4. Yêu cầu chức năng
5. Quy tắc nghiệp vụ
6. Luồng xử lý chính
7. Mô hình dữ liệu
8. Thiết kế API
9. Giao diện và trải nghiệm
10. Yêu cầu phi chức năng
11. Kiểm thử và nghiệm thu
12. Lộ trình triển khai
13. Các điểm cần xác nhận
14. Tổng hợp chỉnh sửa

## 1. Mục tiêu và phạm vi

### 1.1. Mục tiêu

PitchPro tập trung thông tin đội bóng vào một hệ thống thống nhất để:

- Quản lý hồ sơ và danh sách cầu thủ theo mùa giải.
- Chuẩn bị đội hình thi đấu, lịch trận và lịch tập.
- Ghi nhận kết quả, sự kiện trận đấu và chuyên cần tập luyện.
- Tính thống kê từ dữ liệu trận đấu đã xác nhận.
- Cho phép cầu thủ xem thông tin cá nhân và lịch hoạt động của đội.

Chỉ số kỹ thuật 1–99 là đánh giá do HLV nhập, không phải kết quả phân tích AI hoặc dữ liệu tự động thu từ video.

### 1.2. Phạm vi bản đầu tiên — MVP

MVP phục vụ **một đội bóng, nhiều mùa giải**, thi đấu bóng đá 11 người. Đối thủ là thông tin của trận đấu, chưa có tài khoản quản trị riêng. Không hỗ trợ nhiều câu lạc bộ độc lập trong cùng phiên bản.

| Trong phạm vi MVP | Ngoài phạm vi MVP |
| --- | --- |
| Đăng nhập, đổi mật khẩu, quản lý tài khoản nội bộ | Đăng ký công khai, đăng nhập mạng xã hội |
| Quản lý đội, mùa giải, hồ sơ cầu thủ | Chuyển nhượng, hợp đồng, tiền lương, thanh toán |
| Đội hình, chiến thuật, lịch đấu, kết quả | Xem trực tiếp, đồng bộ dữ liệu thể thao bên ngoài |
| Lịch tập, điểm danh, thông báo trong ứng dụng | Email/SMS/push tự động |
| Thống kê mùa giải, dashboard | AI dự đoán, phân tích video, thiết bị đeo |
| Ảnh cầu thủ, logo đội, nhật ký thay đổi | Quản lý toàn bộ giải đấu, bảng xếp hạng nhiều đội |

### 1.3. Quy ước

- **Admin:** Quản trị tài khoản và cấu hình, có quyền nghiệp vụ của HLV.
- **Manager:** HLV/người quản lý chuyên môn.
- **Player:** Tài khoản cầu thủ liên kết với một hồ sơ cầu thủ.
- **P0:** Chức năng thuộc MVP, bắt buộc trước nghiệm thu.
- **P1:** Cải tiến sau MVP, không chặn nghiệm thu MVP.
- **Dữ liệu xác nhận:** Kết quả trận được HLV/Admin chốt sau khi kiểm tra hợp lệ.
- Lưu thời điểm dưới UTC, hiển thị theo múi giờ của đội; mặc định đề xuất `Asia/Ho_Chi_Minh`. Ngày sinh là ngày lịch `YYYY-MM-DD`, không quy đổi múi giờ.

## 2. Tác nhân và phân quyền

### 2.1. Ma trận quyền

| Chức năng | Admin | Manager | Player |
| --- | --- | --- | --- |
| Quản lý tài khoản, cấp/thu hồi quyền | Có | Không | Không |
| Cấu hình đội, tạo/đóng mùa giải | Có | Không | Không |
| Xem danh sách cơ bản của đội | Có | Có | Có |
| Tạo/sửa/lưu trữ hồ sơ cầu thủ | Có | Có | Không |
| Xem chỉ số kỹ thuật, thống kê cá nhân | Tất cả | Tất cả | Chỉ bản thân |
| Sửa chỉ số kỹ thuật, trạng thái sẵn sàng | Có | Có | Không |
| Tạo và công bố đội hình | Có | Có | Chỉ xem đã công bố |
| Quản lý lịch đấu, kết quả, lịch tập | Có | Có | Chỉ xem nội dung công bố |
| Điểm danh tập luyện | Có | Có | Chỉ xem điểm danh bản thân |
| Xem dashboard của đội | Có | Có | Có, không gồm ghi chú nội bộ |
| Xem nhật ký thay đổi | Có | Không | Không |
| Đổi mật khẩu, đọc thông báo cá nhân | Có | Có | Có |

Khách chưa đăng nhập chỉ được truy cập trang đăng nhập. Backend kiểm tra quyền trên từng API và từng bản ghi; việc ẩn nút trên giao diện không thay thế kiểm tra quyền.

Ngoại lệ được phép: Player xem tên, số áo, số bàn thắng và kiến tạo của đồng đội trên bảng xếp hạng tổng hợp của đội; không được truy cập hồ sơ thống kê chi tiết của người khác. Ngoài bảng xếp hạng này, Player chỉ xem tên, số áo, vị trí và ảnh của đồng đội; không được xem ngày sinh đầy đủ, email, cân nặng, ghi chú nội bộ hoặc chi tiết chấn thương của người khác. Không lưu hồ sơ y tế chuyên sâu trong MVP.

### 2.2. Vòng đời tài khoản

- Admin đầu tiên được tạo bằng lệnh khởi tạo có kiểm soát; không có API công khai để tự cấp quyền Admin.
- Admin tạo tài khoản và cấp mật khẩu tạm thời qua kênh nội bộ; người dùng phải đổi khi đăng nhập lần đầu.
- Tài khoản Player phải liên kết với một hồ sơ cầu thủ; một hồ sơ chỉ có tối đa một tài khoản đang liên kết.
- Khóa tài khoản không xóa hồ sơ hoặc lịch sử thi đấu.
- Không cho khóa hoặc hạ quyền Admin hoạt động cuối cùng.
- Khi `mustChangePassword=true`, phiên chỉ được dùng để xem thông tin đăng nhập tối thiểu, đổi mật khẩu và đăng xuất; các API nghiệp vụ bị chặn. Đặt lại mật khẩu hoặc thay vai trò thu hồi toàn bộ phiên cũ.
- Tài khoản liên kết cầu thủ đã rời đội/lưu trữ được khóa cùng thao tác; mở khóa hoặc chuyển liên kết chỉ do Admin thực hiện. Lịch sử thi đấu không bị xóa.
- MVP dùng Admin đặt lại mật khẩu tạm thời khi quên mật khẩu; tự khôi phục qua email là P1.

## 3. Công nghệ và kiến trúc

### 3.1. Công nghệ giữ từ bản gốc

| Thành phần | Lựa chọn | Trách nhiệm |
| --- | --- | --- |
| Frontend | ReactJS, Vite | Giao diện web |
| Giao diện | Tailwind CSS, Lucide Icons | Bố cục, biểu tượng, Dark/Light Mode |
| Điều hướng và HTTP | React Router DOM, Axios | Phân trang ứng dụng, gọi API |
| Backend | Node.js, Express.js | API, phân quyền, nghiệp vụ |
| Dữ liệu | MongoDB, Mongoose | Lưu trữ, kiểm tra schema, chỉ mục |
| Xác thực | JWT, bcryptjs | Phiên đăng nhập, băm mật khẩu |
| Hình ảnh | Multer, Cloudinary | Nhận, kiểm tra và lưu ảnh |
| Công cụ | ESLint, Prettier, Git/GitHub | Chất lượng mã và quản lý phiên bản |

Mật khẩu được **băm**, không mô tả là mã hóa có thể giải ngược. Chốt phiên bản thư viện khi khởi tạo dự án, lưu lockfile; không sử dụng phiên bản không xác định trong triển khai.

### 3.2. Phân lớp

Frontend gọi REST API qua HTTPS. Backend được chia thành `routes → middleware → controllers → services → models`. Quy tắc nghiệp vụ và tính thống kê nằm ở lớp service. MongoDB là nguồn dữ liệu nghiệp vụ; Cloudinary giữ ảnh, cơ sở dữ liệu chỉ lưu URL và `publicId`.

Frontend không được kết nối trực tiếp MongoDB hoặc giữ thông tin bí mật của Cloudinary. Nếu triển khai thao tác nhiều collection bằng transaction, môi trường MongoDB phải hỗ trợ transaction; lựa chọn cấu hình này là điều kiện triển khai, không được giả định mọi máy chủ local đều đáp ứng.

## 4. Yêu cầu chức năng

### 4.1. Xác thực và tài khoản — P0

| Mã | Yêu cầu | Điều kiện chấp nhận |
| --- | --- | --- |
| FR-A01 | Đăng nhập bằng email và mật khẩu | Đúng thông tin và tài khoản hoạt động mới tạo phiên; lỗi không tiết lộ email có tồn tại |
| FR-A02 | Đăng xuất và làm mới phiên | Đăng xuất thu hồi phiên; refresh token đã thu hồi không dùng lại được |
| FR-A03 | Đổi mật khẩu | Kiểm tra mật khẩu hiện tại; đổi thành công thu hồi các phiên cũ |
| FR-A04 | Quản lý tài khoản | Chỉ Admin tạo, khóa, đặt lại mật khẩu, gán vai trò và liên kết cầu thủ |
| FR-A05 | Bảo vệ truy cập | Người chưa đăng nhập bị từ chối; Player không thể sửa dữ liệu bằng gọi API trực tiếp |

### 4.2. Đội bóng và mùa giải — P0

- **FR-T01:** Cấu hình tên đội, logo, sân mặc định và múi giờ.
- **FR-T02:** Tạo mùa giải gồm tên, ngày bắt đầu/kết thúc và trạng thái `PLANNED`, `ACTIVE`, `CLOSED`; tối đa một mùa `ACTIVE`.
- **FR-T03:** Đăng ký cầu thủ vào mùa, cấp số áo và thời gian tham gia. Chuyển mùa không sao chép số liệu thi đấu cũ; chỉ sao chép danh sách khi người dùng chủ động chọn.
- **FR-T04:** Mùa đã đóng chỉ cho xem. Admin muốn sửa phải mở lại, nhập lý do và ghi nhật ký. Đóng mùa bị chặn khi còn trận chưa COMPLETED/CANCELLED, trận COMPLETED chưa xác nhận, buổi tập chưa COMPLETED/CANCELLED hoặc buổi COMPLETED chưa chốt điểm danh. Không có sự kiện nào thì được đóng mùa.

### 4.3. Quản lý cầu thủ — P0

- **FR-P01:** Tạo/sửa hồ sơ: họ tên, ngày sinh, quốc tịch, vị trí chính/phụ, chiều cao, cân nặng, chân thuận và ảnh đại diện. Số áo thuộc đăng ký mùa giải.
- **FR-P02:** Tìm theo tên hoặc số áo trong mùa; lọc vị trí, tình trạng sẵn sàng, tình trạng đăng ký; sắp xếp và phân trang.
- **FR-P03:** Xem hồ sơ và thống kê theo mùa giải; giữ được lịch sử của cầu thủ đã rời đội.
- **FR-P04:** Nhập các chỉ số nguyên 1–99: tốc độ, dứt điểm, chuyền bóng, thể lực, phòng ngự, tắc bóng; ghi người cập nhật và thời điểm. Chưa đánh giá dùng `null`, không dùng 0.
- **FR-P05:** Lưu trữ hồ sơ thay cho xóa vật lý khi đã có liên kết trận đấu, mùa giải hoặc điểm danh. Hồ sơ lưu trữ không xuất hiện trong danh sách chọn mới nhưng vẫn hiển thị trong lịch sử.
- **FR-P06:** Upload/thay ảnh; khi thất bại giữ ảnh cũ, hiển thị lỗi và cho thử lại.

### 4.4. Đội hình và chiến thuật — P0

- **FR-L01:** Tạo mẫu chiến thuật 4-3-3, 4-2-3-1, 3-5-2 hoặc cấu hình vị trí tương đương; các dãy số không tính thủ môn.
- **FR-L02:** Xếp cầu thủ vào vị trí trên sân bằng kéo thả và bằng chọn từ danh sách; có danh sách dự bị.
- **FR-L03:** Lưu bản nháp thiếu người; chỉ công bố khi có đúng 11 cầu thủ đá chính, đúng một vị trí thủ môn và không trùng người.
- **FR-L04:** Đội hình gắn với một trận, có trạng thái `DRAFT`/`PUBLISHED`; Player chỉ thấy bản công bố.
- **FR-L05:** Kiểm tra điều kiện cầu thủ khi lưu và kiểm tra lại khi công bố; cảnh báo nếu cầu thủ chơi khác vị trí sở trường, chặn nếu không đủ điều kiện thi đấu.
- **FR-L06:** Khi trận còn SCHEDULED có thể sửa đội hình; khi chuyển IN_PROGRESS, hệ thống kiểm tra lại và khóa đội hình xuất phát; sau đó thay đổi diễn biến bằng sự kiện thay người, không sửa ngược đội hình ban đầu. Sửa sai sau trận cần mở lại kết quả và lưu lý do.

### 4.5. Trận đấu và kết quả — P0

- **FR-M01:** Tạo lịch: mùa giải, đối thủ, tên giải/giao hữu, ngày giờ, địa điểm, sân nhà/sân khách/sân trung lập, thời lượng chính thức, giới hạn dự bị và thay người.
- **FR-M02:** Xem lịch dạng danh sách/lịch; lọc mùa, ngày, trạng thái. Cảnh báo khi trùng giờ trận hoặc lịch tập của đội.
- **FR-M03:** Hỗ trợ `SCHEDULED`, `POSTPONED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`; lưu lý do hoãn/hủy và lịch sử đổi giờ.
- **FR-M04:** Ghi bàn thắng, kiến tạo, phản lưới nhà, thẻ vàng, thẻ đỏ trực tiếp, thẻ vàng thứ hai và thay người; xác định phía đội nhà quản lý/đối thủ, thời gian và thứ tự sự kiện.
- **FR-M05:** Nhập tỷ số chính thức, số phút thi đấu và số đường chuyền thành công/tổng số đường chuyền của từng cầu thủ. Đối thủ không cần hồ sơ cầu thủ; thông tin người ghi bàn đối thủ có thể để trống.
- **FR-M06:** Lưu nháp kết quả; xác nhận chỉ khi tỷ số khớp sự kiện ghi bàn và các chỉ số cá nhân hợp lệ. Xác nhận làm thay đổi thống kê mùa đúng một lần.
- **FR-M07:** Mở lại kết quả đã xác nhận để sửa có lý do; trong lúc mở lại, trận không được tính vào dashboard. Xác nhận lại thay thế kết quả cũ, không cộng dồn lần nữa.
- **FR-M08:** Lịch trận có `publicationState=DRAFT/PUBLISHED` độc lập trạng thái thi đấu. Chỉ lịch PUBLISHED được hiển thị cho Player; lịch nháp không tạo thông báo. Công bố lịch không tự công bố đội hình hoặc kết quả nháp.

MVP không xử lý hiệp phụ, loạt luân lưu, thay người quay vòng hoặc xử thắng hành chính. Các trận có các trường hợp này cần mở rộng đặc tả trước khi nhập kết quả, tránh diễn giải sai tỷ lệ thắng/thua.

### 4.6. Lịch tập và điểm danh — P0

- **FR-R01:** Tạo/sửa/hủy buổi tập: mùa, tiêu đề, mục tiêu, bắt đầu/kết thúc, địa điểm và danh sách tham gia.
- **FR-R02:** Gửi thông báo trong ứng dụng khi công bố, đổi thời gian/địa điểm hoặc hủy buổi tập.
- **FR-R03:** Điểm danh `PRESENT`, `LATE`, `EXCUSED`, `ABSENT`; chưa điểm danh là `UNMARKED`, không tự tính vắng.
- **FR-R04:** Mỗi cầu thủ có một bản ghi trong một buổi; cập nhật bản ghi cũ thay vì tạo bản ghi trùng.
- **FR-R05:** Chốt điểm danh chỉ khi toàn bộ người được mời có trạng thái; sửa sau khi chốt phải ghi nhật ký.
- **FR-R06:** Cầu thủ xem lịch được mời và lịch sử điểm danh của mình.

### 4.7. Thống kê và dashboard — P0

- **FR-S01:** Chọn mùa giải; hiển thị số trận đã xác nhận, thắng/hòa/thua, bàn thắng/bàn thua, top ghi bàn và top kiến tạo.
- **FR-S02:** Thống kê cầu thủ: số trận ra sân, số trận đá chính, bàn thắng, kiến tạo, thẻ phạt, phút thi đấu, tỷ lệ chuyền chính xác.
- **FR-S03:** Chỉ sử dụng trận `COMPLETED` có `resultState=CONFIRMED`. Trận hủy/hoãn/chưa chốt không tính.
- **FR-S04:** Thể hiện rõ mùa và bộ lọc đang áp dụng. Khi không có dữ liệu hiển thị trạng thái trống; tỷ lệ không tính được hiển thị “Chưa có dữ liệu”.
- **FR-S05:** Xếp hạng đồng điểm cùng thứ hạng, sắp tên để ổn định thứ tự hiển thị; không tự tạo tiêu chí phụ không công bố.

### 4.8. Thông báo và nhật ký — P0

- **FR-N01:** Thông báo cá nhân khi lịch thi đấu/lịch tập được công bố, thay đổi hoặc hủy; khi đội hình được công bố. Lưu người nhận, liên kết nội dung, thời điểm và `readAt`.
- **FR-N02:** Chỉ người nhận được đánh dấu đã đọc. Thông báo không chứa ghi chú chuyên môn bí mật.
- **FR-N03:** Ghi nhật ký: người thao tác, hành động, loại đối tượng, ID, thời gian, trường thay đổi và lý do nếu bắt buộc. Không ghi mật khẩu, token hoặc nội dung bí mật.
- **FR-N04:** Không gửi thông báo cho thay đổi bản nháp; mỗi lần công bố/cập nhật có khóa chống tạo trùng. Lỗi thông báo được lưu để thử lại, không làm mất thao tác nghiệp vụ đã thành công.

## 5. Quy tắc nghiệp vụ

### 5.1. Hồ sơ và đăng ký mùa

| Mã | Quy tắc |
| --- | --- |
| BR-01 | Họ tên bắt buộc, trim, dài 2–100 ký tự; hỗ trợ Unicode và dấu tiếng Việt |
| BR-02 | Ngày sinh hợp lệ, không sau ngày hiện tại; chưa đặt giới hạn tuổi khi chưa biết nhóm thi đấu |
| BR-03 | Email trim, chuẩn hóa chữ thường và duy nhất; kiểm tra ở API và unique index |
| BR-04 | Số áo là số nguyên 1–99, duy nhất trong nhóm đăng ký `ACTIVE` của cùng đội và mùa |
| BR-05 | Chiều cao nếu nhập: 100–230 cm; cân nặng: 25–200 kg; đây là giới hạn đề xuất cần điều chỉnh cho đội trẻ |
| BR-06 | Chân thuận: `LEFT`, `RIGHT`, `BOTH`; vị trí theo danh mục GK, CB, LB, RB, LWB, RWB, DM, CM, AM, LW, RW, ST |
| BR-07 | Tách tình trạng sức khỏe `FIT`/`INJURED`, tình trạng đăng ký `ACTIVE`/`ON_LOAN`/`LEFT`, và đình chỉ thi đấu; không gộp thành một enum làm mất thông tin |
| BR-08 | Chỉ chọn vào đội hình khi đăng ký có hiệu lực tại ngày trận, trạng thái ACTIVE, không chấn thương và không bị đình chỉ áp dụng cho trận |
| BR-09 | Đình chỉ do HLV nhập rõ trận bị cấm và lý do; MVP không tự suy ra án phạt theo số thẻ vì mỗi giải có luật khác nhau |
| BR-10 | Thay trạng thái hiện tại không sửa lịch sử ra sân đã xác nhận; trạng thái đủ điều kiện tại lúc chốt được lưu cùng đội hình |

### 5.2. Sự kiện trận đấu

- **BR-11:** Một cầu thủ không được đồng thời ở danh sách đá chính và dự bị. Danh sách dự bị không vượt cấu hình của trận; mặc định đề xuất tối đa 9 người, tối đa 5 lượt thay cầu thủ, không xử lý giới hạn số đợt thay trong MVP.
- **BR-12:** Cầu thủ vào sân phải thuộc dự bị, chưa vào sân, chưa bị truất quyền; người ra phải đang ở trên sân. Không cho cầu thủ đã ra sân quay lại.
- **BR-13:** Mỗi sự kiện có `elapsedSeconds` không âm tính từ đầu trận và `sequence` để phân biệt cùng thời điểm; không dùng số thập phân như `45.2` để biểu diễn phút bù giờ. Thời gian sự kiện không vượt thời lượng thực tế khi xác nhận kết quả.
- **BR-14:** Ghi bàn thường chỉ cho cầu thủ đang trên sân. Kiến tạo tối đa một người cùng đội, khác người ghi bàn và đang trên sân; cho phép không có kiến tạo. Bàn phản lưới không cộng bàn hoặc kiến tạo cho cầu thủ đội được hưởng.
- **BR-15:** Thẻ có thể áp dụng cho cầu thủ đã đăng ký trận dù đang dự bị/đã ra sân. Thẻ vàng thứ hai phải có thẻ vàng thứ nhất trước đó; khi xảy ra, tăng tổng thẻ vàng và đánh dấu bị truất quyền, không tạo thêm thẻ đỏ trực tiếp trùng cho cùng lần truất quyền.
- **BR-16:** Giao diện phân biệt số thẻ đỏ trực tiếp và số lần bị truất quyền do hai thẻ vàng. Tổng lần bị truất quyền = thẻ đỏ trực tiếp + lần nhận thẻ vàng thứ hai.
- **BR-17:** Tỷ số đội được quản lý = bàn thường của đội + phản lưới của đối thủ; tương tự với đối thủ. Tổng sự kiện phải khớp tỷ số chốt, kể cả khi chưa biết danh tính người ghi bàn đối thủ.
- **BR-18:** Chỉ số phút thi đấu là số nguyên không âm, không vượt thời lượng thực tế của trận làm tròn lên theo phút. HLV kiểm tra và xác nhận từ đội hình/sự kiện; MVP không tuyên bố tự động tính chính xác từ đồng hồ trận đấu.
- **BR-19:** `played` xác định từ đá chính hoặc đã vào sân hợp lệ, không suy luận chỉ từ `minutesPlayed > 0`, vì một cầu thủ có thể vào sân dưới một phút.

### 5.3. Công thức thống kê

| Chỉ số | Cách tính |
| --- | --- |
| Số trận ra sân | Đếm trận đã xác nhận có `played=true` của cầu thủ |
| Bàn thắng/kiến tạo | Tổng sự kiện hợp lệ của cầu thủ trong trận đã xác nhận; không tính phản lưới vào bàn thắng cá nhân |
| Phút thi đấu | Tổng `minutesPlayed` đã xác nhận |
| Tỷ lệ chuyền chính xác | `100 × tổng passesCompleted / tổng passesAttempted`; không lấy trung bình tỷ lệ từng trận |
| Tỷ lệ thắng | `100 × số trận thắng / số trận đã xác nhận` |
| Tỷ lệ chuyên cần | `100 × (PRESENT + LATE) / (PRESENT + LATE + ABSENT)` trong buổi đã chốt |

`EXCUSED` không nằm trong mẫu số chuyên cần. Buổi hủy hoặc chưa chốt không tính. Mẫu số bằng 0 trả về `null` và hiển thị “Chưa có dữ liệu”. Phần trăm hiển thị một chữ số thập phân. Số đường chuyền chưa thu thập dùng `null` cho cả hai trường; nếu có dữ liệu thì `0 ≤ passesCompleted ≤ passesAttempted`. Giao diện hiển thị thêm số trận có dữ liệu chuyền bóng để người xem hiểu độ bao phủ.

### 5.4. Thời gian, dữ liệu bắt buộc và phạm vi công bố

- **BR-20:** Bắt buộc với hồ sơ: họ tên, ngày sinh, vị trí chính, chân thuận. Quốc tịch, chiều cao, cân nặng và ảnh được bỏ trống. Giá trị chuỗi rỗng của trường tùy chọn được chuẩn hóa thành `null`.
- **BR-21:** Ngày trận/ngày tập nằm trong thời gian mùa, tính theo múi giờ của đội. Trận có `expectedEndsAt > scheduledAt`; buổi tập có `endsAt > startsAt`. Khi sửa khoảng ngày của mùa, không được làm sự kiện hoặc đăng ký đã có nằm ngoài khoảng mới.
- **BR-22:** Hai lịch trùng khi `startA < endB` và `startB < endA`. Lịch kết thúc đúng lúc lịch khác bắt đầu không bị coi là trùng. Bỏ qua lịch CANCELLED và trận POSTPONED chưa có giờ mới. Hệ thống cảnh báo; HLV có thể tiếp tục sau khi xác nhận và nhập lý do, ghi audit.
- **BR-23:** Mùa PLANNED cho phép chuẩn bị đăng ký và lịch; chỉ mùa ACTIVE cho phép bắt đầu trận hoặc hoàn tất buổi tập. Mở lại mùa CLOSED chuyển thành ACTIVE và bị chặn nếu đã có mùa ACTIVE khác. Dữ liệu hồ sơ cá nhân độc lập với khóa mùa; số áo, đánh giá và dữ liệu sự kiện của mùa CLOSED vẫn bị khóa.
- **BR-24:** `joinedOn` không sau `leftOn` nếu có; cả hai thuộc mùa. Một cầu thủ có một đăng ký mỗi mùa trong MVP. Đổi số áo hoặc trạng thái không làm đổi số áo đã chụp lại ở đội hình trận cũ. Quản lý nhiều đợt đi/đến trong cùng mùa là mở rộng sau MVP.
- **BR-25:** Khi công bố đội hình, kiểm tra tình trạng hiện tại; khi bắt đầu trận, kiểm tra lại và lưu `eligibilitySnapshot`. Nếu có người không đủ điều kiện, phải sửa và công bố lại trước khi bắt đầu. Khi sửa kết quả trận cũ, dùng snapshot lúc trận bắt đầu; không dùng tình trạng chấn thương hiện tại để phủ nhận lịch sử.
- **BR-26:** `resultState` mặc định DRAFT; chỉ COMPLETED mới được CONFIRMED. Player được xem lịch và đội hình đã công bố, nhưng chỉ xem chi tiết kết quả khi CONFIRMED. Khi mở lại, hiển thị “Kết quả đang được điều chỉnh”, không lộ dữ liệu nháp.
- **BR-27:** `elapsedSeconds` tính thời gian thi đấu lũy kế, gồm bù giờ và bỏ thời gian nghỉ giữa hiệp. `actualDurationSeconds` dùng cùng quy ước; không lấy chênh lệch thời gian trên đồng hồ treo tường. MVP hiển thị thời gian lũy kế, chưa hỗ trợ định dạng chuyên biệt 45+2/90+3.
- **BR-28:** Các kiểm tra đội hình, thay người và trạng thái trên sân áp dụng đầy đủ cho TEAM. Với OPPONENT, MVP chỉ bắt buộc các bàn thắng/phản lưới ảnh hưởng tỷ số; không yêu cầu đội hình, thẻ hoặc thay người đối thủ. `side` là phía của người thực hiện sự kiện; OWN_GOAL được cộng cho phía còn lại. Sự kiện của TEAM phải có tham chiếu cầu thủ tương ứng; sự kiện của OPPONENT không được tham chiếu cầu thủ của đội.
- **BR-29:** Sau khi bị truất quyền, cầu thủ không thể ghi bàn, kiến tạo, vào sân hay nhận thêm sự kiện thẻ làm tăng lần truất quyền trong cùng trận. Nếu bị truất quyền khi đang đá, giảm người trên sân và không thay bằng dự bị. Mọi điều kiện được kiểm tra lại theo thứ tự thời gian khi sửa/xóa một sự kiện trước đó.
- **BR-30:** Khi xác nhận, mỗi người trong đội hình phải có đúng một `playerMatchStats`. Dự bị không vào sân có `played=false`, `minutesPlayed=0`, không có đường chuyền; `started` và `played` do backend suy ra. Cầu thủ ra sân phải có số phút đã nhập; tổng đường chuyền là số nguyên không âm hoặc cặp null.

## 6. Luồng xử lý chính

### 6.1. Thêm cầu thủ

1. HLV/Admin mở danh sách và chọn thêm.
2. Nhập hồ sơ, chọn mùa và số áo; ảnh là tùy chọn.
3. Backend kiểm tra quyền, dữ liệu và trùng số áo.
4. Lưu hồ sơ và đăng ký mùa một cách nguyên tử; nếu không thành công thì không để hồ sơ đăng ký dang dở.
5. Hiển thị thành công, cập nhật danh sách và ghi nhật ký.

### 6.2. Chuẩn bị trận và công bố đội hình

1. HLV tạo lịch trong mùa đang mở và chọn cấu hình trận.
2. Hệ thống kiểm tra thời gian, cảnh báo trùng lịch.
3. HLV công bố lịch trận; sau đó chọn cầu thủ và lưu nháp đội hình.
4. Khi công bố, hệ thống kiểm tra lại số lượng, trùng người và điều kiện thi đấu.
5. Lưu bản công bố, tạo thông báo cho các tài khoản cầu thủ liên quan.

### 6.3. Kết thúc và sửa kết quả

1. Trận chuyển `SCHEDULED → IN_PROGRESS → COMPLETED`.
2. HLV nhập sự kiện, tỷ số và chỉ số còn thiếu; kết quả ở trạng thái `DRAFT`.
3. Hệ thống xác thực toàn bộ dữ liệu trước khi đổi thành `CONFIRMED`.
4. Dashboard đọc dữ liệu xác nhận và cập nhật số liệu.
5. Nếu sai, HLV/Admin mở lại kèm lý do; khóa sửa khi chưa mở lại. Xác nhận lại thay thế bản trước.

Chuyển trạng thái bổ sung: `SCHEDULED → POSTPONED/CANCELLED`, `POSTPONED → SCHEDULED/CANCELLED`; hoãn phải lập lại giờ trước khi trở về `SCHEDULED`. Trận đang diễn ra chỉ được hủy khi nhập lý do. `CANCELLED` là trạng thái cuối; cần tổ chức lại thì tạo trận mới. Mở lại kết quả giữ trận `COMPLETED`, chỉ đổi `resultState` thành `DRAFT`.

### 6.4. Xử lý lỗi và xung đột

- Form sai: giữ dữ liệu đã nhập, chỉ rõ trường và nguyên nhân.
- Phiên hết hạn: thử làm mới một lần; thất bại thì chuyển đăng nhập.
- Hai người cùng sửa: dùng trường `version`; yêu cầu dựa trên phiên bản cũ trả `409`, cho tải dữ liệu mới trước khi chỉnh lại.
- Nhấn nút xác nhận nhiều lần: kết quả không được cộng lặp; hành động chốt có khóa idempotency hoặc kiểm tra chuyển trạng thái nguyên tử.
- Dịch vụ ảnh lỗi: không thay URL cũ; tác vụ dọn ảnh mồ côi được thử lại sau.

### 6.5. Vòng đời lịch tập và điểm danh

| Thao tác | Trạng thái trước → sau | Điều kiện |
| --- | --- | --- |
| Công bố | DRAFT → PUBLISHED | Danh sách tham gia không rỗng, lịch hợp lệ, mùa PLANNED/ACTIVE |
| Hoàn tất | PUBLISHED → COMPLETED | Đã qua giờ kết thúc, mùa ACTIVE |
| Hủy | DRAFT/PUBLISHED → CANCELLED | Có lý do; chỉ thông báo nếu trước đó đã công bố |
| Chốt điểm danh | OPEN → FINALIZED | Buổi COMPLETED; tất cả người tham gia đã được điểm danh |
| Mở lại điểm danh | FINALIZED → OPEN | Buổi COMPLETED, mùa ACTIVE, có lý do; tạm loại khỏi thống kê chuyên cần |

Buổi CANCELLED không được điểm danh hoặc hoàn tất; tổ chức lại thì tạo buổi mới. Buổi COMPLETED không được hủy trực tiếp. Danh sách tham gia được sửa trước khi COMPLETED; loại người đã có điểm danh phải xác nhận và ghi audit. Sau khi COMPLETED, danh sách cố định; chỉnh sai danh sách là ngoại lệ cần Admin xử lý có kiểm soát, không cung cấp thao tác tự do trong MVP. Trong trạng thái FINALIZED, API sửa điểm danh bị chặn cho đến khi mở lại.

### 6.6. Phân phối thông báo

- Lịch trận công bố/đổi/hủy: gửi đến tài khoản Player đang hoạt động của đăng ký ACTIVE trong mùa tại thời điểm thao tác.
- Đội hình công bố/cập nhật: gửi cho người thuộc đội hình mới và người bị bỏ khỏi bản công bố trước, nếu tài khoản còn hoạt động.
- Lịch tập công bố/đổi/hủy: gửi cho người được mời; khi thay danh sách, báo riêng người thêm và người bị loại.
- Ghi `notificationJobs` cùng giao dịch cập nhật nghiệp vụ. Worker tạo thông báo với unique key theo người nhận, đối tượng, phiên bản và loại sự kiện. Thử lại không tạo bản sao; sau 5 lần thất bại chuyển FAILED và ghi lỗi để vận hành thử lại.
- Người nhận bấm thông báo vẫn phải qua kiểm tra quyền hiện tại; thông báo cũ không cấp quyền xem nội dung đã bị thu hồi.

## 7. Mô hình dữ liệu

### 7.1. Các collection chính

Tất cả collection nghiệp vụ có `_id`, `createdAt`, `updatedAt`; bản ghi có thể chỉnh sửa đồng thời có `version`. Các trường tham chiếu phải được service kiểm tra tồn tại và đúng mùa/đội; MongoDB không tự thay thế toàn bộ kiểm tra khóa ngoại.

| Collection | Trường chính | Ràng buộc và mục đích |
| --- | --- | --- |
| `users` | email, passwordHash, role, playerId?, status, mustChangePassword | Email duy nhất; role ADMIN/MANAGER/PLAYER; status ACTIVE/LOCKED |
| `refreshSessions` | userId, tokenHash, expiresAt, revokedAt, replacedBySessionId | Không lưu refresh token dạng rõ; chỉ mục hết hạn |
| `teams` | name, logoUrl, logoPublicId, timezone, defaultVenue | Một đội trong MVP |
| `seasons` | teamId, name, startDate, endDate, status | Ngày bắt đầu không sau kết thúc; tên duy nhất trong đội |
| `players` | fullName, dob, nationality, primaryPosition, secondaryPositions, heightCm, weightKg, preferredFoot, avatarUrl, avatarPublicId, fitnessStatus, archivedAt | Hồ sơ xuyên mùa, không lưu tổng bàn thắng cố định tại đây |
| `seasonRegistrations` | teamId, seasonId, playerId, shirtNumber, status, joinedOn, leftOn | Một đăng ký/cầu thủ/mùa; số áo ACTIVE không trùng |
| `playerRatings` | playerId, seasonId, pace, shooting, passing, stamina, defending, tackling, evaluatedBy, evaluatedAt | Một bộ chỉ số hiện hành/cầu thủ/mùa; lịch sử sửa trong audit |
| `suspensions` | playerId, seasonId, matchIds, reason, status | Áp dụng theo trận cụ thể; ACTIVE/REVOKED |
| `tacticTemplates` | teamId, name, formation, slots, createdBy | Vị trí tương đối trên sân, không chứa thống kê |
| `matches` | teamId, seasonId, opponent, competition, scheduledAt, venue, venueType, status, publicationState, publishedAt, expectedEndsAt, resultState, scoreFor, scoreAgainst, regulationMinutes, actualDurationSeconds, maxSubstitutes, maxSubstitutions, confirmedAt, confirmedBy | Tỷ số để null khi chưa nhập; không mặc định trận chưa đá là 0–0 |
| `lineups` | matchId, formation, starters, substitutes, eligibilitySnapshot, eligibilityCheckedAt, lockedAt, status, publishedAt | Duy nhất theo matchId; lưu playerId và số áo tại trận |
| `matchEvents` | matchId, eventType, side, playerId?, assistPlayerId?, playerOutId?, playerInId?, elapsedSeconds, sequence | eventType GOAL/OWN_GOAL/YELLOW/SECOND_YELLOW/RED/SUBSTITUTION; side TEAM/OPPONENT |
| `playerMatchStats` | matchId, playerId, started, played, minutesPlayed, passesCompleted, passesAttempted | Duy nhất cặp matchId/playerId; started/played đối chiếu đội hình và thay người |
| `trainingSessions` | seasonId, title, objective, startsAt, endsAt, venue, participantIds, status, attendanceState | status DRAFT/PUBLISHED/COMPLETED/CANCELLED; attendanceState OPEN/FINALIZED |
| `attendances` | trainingSessionId, playerId, status, note, markedBy | Duy nhất cặp buổi/cầu thủ; chỉ người trong danh sách tham gia |
| `notifications` | recipientId, type, entityType, entityId, title, readAt, deduplicationKey | Người nhận riêng; khóa chống trùng theo lần cập nhật |
| `notificationJobs` | entityType, entityId, entityVersion, recipientIds, type, status, attempts, nextAttemptAt | Tác vụ thông báo được tạo cùng giao dịch nghiệp vụ; PENDING/PROCESSING/SENT/FAILED |
| `auditLogs` | actorId, action, entityType, entityId, changedFields, reason, createdAt | Chỉ ghi thêm từ backend; không cho người dùng sửa/xóa qua API |

### 7.2. Quan hệ

- Một đội có nhiều mùa; một cầu thủ tham gia nhiều mùa qua `seasonRegistrations`.
- Một mùa có nhiều trận và buổi tập.
- Một trận có một đội hình, nhiều sự kiện và nhiều bản ghi chỉ số cầu thủ.
- Một buổi tập có nhiều bản ghi điểm danh, mỗi cầu thủ một bản ghi.
- Một tài khoản Player gắn một cầu thủ; Admin/Manager không bắt buộc có hồ sơ cầu thủ.

### 7.3. Chỉ mục và tính nhất quán

- Unique: `users.email`; `seasonRegistrations(seasonId, playerId)`; `lineups.matchId`; `playerMatchStats(matchId, playerId)`; `attendances(trainingSessionId, playerId)`; `playerRatings(playerId, seasonId)`; `seasons(teamId, name)`; `notifications(recipientId, deduplicationKey)`; `matchEvents(matchId, sequence)`.
- Partial unique: số áo theo `(teamId, seasonId, shirtNumber)` cho đăng ký ACTIVE; `users.playerId` khi có giá trị; một mùa ACTIVE cho mỗi đội.
- Truy vấn: `matches(seasonId, scheduledAt)`, `matchEvents(matchId, elapsedSeconds, sequence)`, `trainingSessions(seasonId, startsAt)`, `notifications(recipientId, createdAt)`.
- Không xóa dây chuyền hồ sơ có lịch sử. Tham chiếu bị lưu trữ vẫn được dùng để xem trận cũ.
- Bàn thắng, kiến tạo, thẻ và tổng mùa được tính từ sự kiện/kết quả xác nhận, không cho người dùng sửa riêng một tổng khác nguồn gốc.
- Nếu bổ sung bộ nhớ đệm thống kê, phải có cơ chế vô hiệu hóa khi mở lại/chốt trận; MVP có thể tính trực tiếp để giảm sai lệch.

## 8. Thiết kế API

### 8.1. Quy ước

Tiền tố `/api/v1`; JSON UTF-8; ngày giờ theo ISO 8601. API danh sách dùng `page`, `limit`, `sort`, `search` và bộ lọc được cho phép. `page ≥ 1`, `limit` mặc định 20, tối đa 100; trường sort không hợp lệ bị từ chối. Không đưa trực tiếp truy vấn từ client vào MongoDB.

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu chưa hợp lệ",
    "fields": { "shirtNumber": "Số áo đã được sử dụng trong mùa giải" },
    "requestId": "request-id"
  }
}
```

Mã HTTP: `200/201` thành công, `204` không có nội dung, `400` dữ liệu sai, `401` chưa xác thực, `403` thiếu quyền, `404` không tìm thấy, `409` trùng/xung đột trạng thái hoặc phiên bản, `413` file quá lớn, `415` sai định dạng, `429` vượt giới hạn, `500` lỗi nội bộ. Không trả stack trace ra client.

### 8.2. Nhóm endpoint

| Nhóm | Endpoint đề xuất | Quyền |
| --- | --- | --- |
| Phiên | POST `/auth/login`, `/auth/refresh`, `/auth/logout` | Theo trạng thái phiên |
| Cá nhân | GET `/auth/me`; POST `/auth/change-password` | Đăng nhập |
| Tài khoản | GET/POST `/users`; PATCH `/users/:id`; POST `/users/:id/reset-password` | Admin |
| Đội | GET/PATCH `/team` | Xem: đăng nhập; sửa: Admin |
| Mùa | GET/POST `/seasons`; PATCH `/seasons/:id`; POST `/seasons/:id/close`, `/reopen` | Xem: đăng nhập; ghi: Admin |
| Cầu thủ | GET/POST `/players`; GET/PATCH `/players/:id`; POST `/players/:id/archive` | Ghi: Admin/Manager; đọc theo phạm vi quyền |
| Đăng ký mùa | GET/POST `/seasons/:id/registrations`; PATCH `/registrations/:id` | Ghi: Admin/Manager |
| Đánh giá | GET/PUT `/seasons/:id/players/:playerId/ratings` | Ghi: Admin/Manager; đọc theo quyền |
| Đình chỉ | GET/POST `/suspensions`; PATCH `/suspensions/:id` | Admin/Manager |
| Chiến thuật | GET/POST `/tactics`; PATCH/DELETE `/tactics/:id` | Admin/Manager; xóa mẫu không xóa đội hình trận |
| Lịch đấu | GET/POST `/matches`; GET/PATCH `/matches/:id` | Ghi: Admin/Manager |
| Công bố lịch | POST `/matches/:id/publish` | Admin/Manager; chỉ lịch hợp lệ mới công bố |
| Trạng thái trận | POST `/matches/:id/transitions` | Admin/Manager; kiểm tra chuyển trạng thái |
| Đội hình | GET/PUT `/matches/:id/lineup`; POST `/matches/:id/lineup/publish` | Ghi: Admin/Manager; Player chỉ đọc bản công bố |
| Kết quả | PUT `/matches/:id/result`; POST `/matches/:id/result/confirm`, `/reopen` | Admin/Manager |
| Thống kê | GET `/statistics/team`, `/statistics/players/:id` | Đăng nhập; cá nhân theo quyền |
| Lịch tập | GET/POST `/trainings`; GET/PATCH `/trainings/:id` | Ghi: Admin/Manager |
| Trạng thái lịch tập | POST `/trainings/:id/transitions` | Admin/Manager; áp dụng bảng trạng thái tại mục 6.5 |
| Mở lại điểm danh | POST `/trainings/:id/attendance/reopen` | Admin/Manager; bắt buộc lý do, mùa chưa đóng |
| Điểm danh | GET/PUT `/trainings/:id/attendance`; POST `/trainings/:id/attendance/finalize` | Ghi: Admin/Manager; Player chỉ đọc của mình |
| Thông báo | GET `/notifications`; PATCH `/notifications/:id/read` | Đúng người nhận |
| Ảnh | POST `/players/:id/avatar`, `/team/logo` | Theo quyền sửa đối tượng |
| Nhật ký | GET `/audit-logs` | Admin |

`PUT /matches/:id/result` nhận tỷ số, danh sách sự kiện và chỉ số cầu thủ trong cùng payload; thay thế bản nháp nguyên tử để tránh trạng thái nửa cập nhật. Không chấp nhận sửa trực tiếp `confirmedBy`, `role`, tổng mùa hoặc trường hệ thống qua payload ngoài danh sách cho phép. Các endpoint tổng quát như PATCH không được vượt qua quy tắc chuyển trạng thái.

### 8.3. Hợp đồng cập nhật và bảo vệ dữ liệu

- Các endpoint sửa đối tượng hiện có nhận `version` nguyên không âm. Backend so khớp, cập nhật và tăng version trong cùng thao tác nguyên tử; không khớp trả `409 VERSION_CONFLICT`.
- Với kết quả trận, `matches.version` bảo vệ toàn bộ tỷ số, sự kiện, đội hình được sửa và chỉ số cá nhân liên quan. Chốt/mở lại cũng tăng version. Không cập nhật một phần nếu validation hoặc transaction thất bại.
- Tạo cầu thủ có thể kèm `registration` để tạo hồ sơ và đăng ký mùa trong một giao dịch; tạo chỉ hồ sơ vẫn hợp lệ. API đăng ký riêng dùng cho cầu thủ đã tồn tại.
- Ghi kết quả, đăng ký, thông báo và audit liên quan dùng transaction trên MongoDB được cấu hình hỗ trợ. Cloudinary nằm ngoài transaction: lưu ảnh mới trước, cập nhật DB, sau đó dọn ảnh cũ; lỗi DB thì xếp ảnh mới vào danh sách dọn, không xóa ảnh cũ trước.
- API đọc của Player chỉ trả trường được phép ngay từ backend, không gửi đầy đủ rồi ẩn bằng frontend. Phạm vi này áp dụng cho danh sách, chi tiết, dashboard và liên kết từ thông báo.
- Đăng xuất thu hồi phiên hiện tại; đổi/đặt lại mật khẩu, khóa tài khoản và đổi quyền thu hồi toàn bộ phiên. Refresh token chỉ dùng một lần; phát hiện token đã xoay bị dùng lại thì thu hồi chuỗi phiên liên quan.

## 9. Giao diện và trải nghiệm

### 9.1. Danh mục màn hình chính

| Màn hình | Thành phần chính |
| --- | --- |
| Đăng nhập/đổi mật khẩu | Email, mật khẩu, thông báo lỗi, trạng thái đang xử lý |
| Dashboard | Bộ chọn mùa, thẻ tổng quan, biểu đồ thắng/hòa/thua, top cầu thủ, lịch sắp tới |
| Danh sách cầu thủ | Tìm kiếm, bộ lọc, bảng/thẻ, phân trang, thao tác theo quyền |
| Hồ sơ cầu thủ | Thông tin, chỉ số, thống kê theo mùa, lịch sử tham gia |
| Đội hình | Sân bóng, sơ đồ, danh sách chọn, dự bị, lưu nháp/công bố |
| Lịch và chi tiết trận | Ngày giờ, đối thủ, đội hình, kết quả, sự kiện, trạng thái xác nhận |
| Lịch tập | Lịch, danh sách mời, form điểm danh và chuyên cần |
| Thông báo | Danh sách, chưa đọc/đã đọc, liên kết tới đối tượng |
| Quản trị | Tài khoản, đội, mùa giải, nhật ký |

### 9.2. Nguyên tắc trải nghiệm người dùng (UX)

- Có trạng thái loading, trống (empty state), lỗi, thành công cho từng vùng dữ liệu.
- Hiển thị ngày theo `dd/MM/yyyy`, giờ 24 giờ; ghi múi giờ ở lịch.
- Mobile có thao tác chọn vị trí thay kéo thả; bảng rộng được chuyển sang thẻ hoặc cuộn ngang có chủ đích.
- Có nhãn form, focus bằng bàn phím, thông báo lỗi bằng chữ; màu sắc không là cách duy nhất truyền đạt trạng thái.
- Hủy trận, lưu trữ cầu thủ, đóng mùa và chốt kết quả cần hộp xác nhận nêu rõ tác động.
- Dark/Light Mode ghi nhớ lựa chọn; các màn hình và biểu đồ phải đọc được trong cả hai chế độ.

### 9.3. Hệ thống thiết kế và phong cách thị giác (Design System & UI Vibe)

Để đảm bảo giao diện đồng bộ, chuyên nghiệp và tránh việc mỗi màn hình mang một phong cách khác nhau, toàn bộ hệ thống tuân theo các quy chuẩn sau:

#### A. Định hướng thẩm mỹ (Visual Vibe)
- **Phong cách chủ đạo:** *Modern Athletic Tech / Clean Sports Data* — hiện đại, khỏe khoắn, sắc nét và tập trung hiển thị dữ liệu thể thao trực quan (tham chiếu trải nghiệm các ứng dụng thể thao chuyên nghiệp như SofaScore, FotMob, Premier League App).
- **Cấu trúc bề mặt:** Card-based UI (giao diện phân chia theo thẻ), các khối thông tin độc lập có viền mảnh tinh tế (`border border-slate-200 dark:border-slate-800`), không lạm dụng hiệu ứng bóng đổ (shadow) quá dày.
- **Bo góc (Border Radius):** Nhất quán `rounded-lg` (8px) cho các phần tử nhỏ/nút bấm/input và `rounded-xl` (12px) cho thẻ Card/Modal. Không dùng bo góc tròn quá mức (`rounded-full` chỉ dành cho avatar cầu thủ và badge số áo) để giữ nét thể thao mạnh mẽ.

#### B. Bảng màu hệ thống (Tailwind Color Tokens)
- **Màu thương hiệu (Primary Brand):** `Emerald` (xanh cỏ thể thao hiện đại, tràn đầy năng lượng):
  - Nút bấm chính, điểm nhấn tương tác: `bg-emerald-600 hover:bg-emerald-700` (Light Mode), `bg-emerald-500 hover:bg-emerald-600` (Dark Mode).
  - Vòng sáng / Focus ring: `focus:ring-emerald-500/30`.
- **Màu trung tính & Nền (Neutrals - Hệ màu Slate):**
  - **Light Mode:** Nền trang `bg-slate-50`, nền thẻ/bảng `bg-white`, chữ chính `text-slate-900`, chữ phụ `text-slate-500`, đường viền `border-slate-200`.
  - **Dark Mode:** Nền trang `bg-slate-950`, nền thẻ/bảng `bg-slate-900`, chữ chính `text-slate-100`, chữ phụ `text-slate-400`, đường viền `border-slate-800`. Tuyệt đối không dùng màu đen tuyền (`#000000`).
- **Màu ngữ nghĩa thể thao (Semantic Sports Status):**
  - **Thắng / Trạng thái sẵn sàng (FIT):** `text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50`.
  - **Thua / Chấn thương (INJURED):** `text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50`.
  - **Hòa / Cảnh báo / Treo giò (SUSPENDED):** `text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50`.
  - **Thẻ vàng:** `bg-yellow-400 text-yellow-950`.
  - **Thẻ đỏ:** `bg-red-600 text-white`.

#### C. Kiểu chữ (Typography)
- **Phông chữ giao diện:** Sử dụng font sans-serif hình học hiện đại, dễ đọc trên cả mobile và desktop: `Plus Jakarta Sans` hoặc `Inter`.
- **Hiển thị dữ liệu số (Tỷ số, đồng hồ, số áo):** Sử dụng thuộc tính `tabular-nums` hoặc font số đơn cách (`font-mono font-bold`) để tỷ số và thời gian trận đấu giữ cố định độ rộng, không giật layout khi số liệu nhảy tự động.

#### D. Quy chuẩn Sơ đồ chiến thuật & Sân bóng (Tactical Pitch)
Đây là màn hình trọng tâm dễ bị lệch phong cách nhất, cần chốt quy cách hiển thị:
- **Phong cách đồ họa mặt sân:** 2D Vector phẳng tối giản (Minimalist Vector Board), không dùng cỏ giả 3D tả thực bóng bẩy.
  - **Light Mode:** Nền sân màu xanh cỏ dịu nhẹ (`bg-emerald-800/15` hoặc `bg-emerald-900/10`), đường vôi kẻ mỏng màu trắng xám (`stroke-slate-300`).
  - **Dark Mode:** Nền sân màu xanh kỹ thuật số sẫm (`bg-emerald-950/40`), đường vôi mỏng (`stroke-emerald-500/25`).
- **Nút cầu thủ trên sân (Player Node):**
  - Hiển thị dạng hình tròn Badge viền nổi, số áo to rõ ở giữa, tên rút gọn và vị trí đặt ngay dưới hình tròn.
  - Màu áo phân biệt rõ giữa Thủ môn (GK) và cầu thủ tuyến trên; có chấm đỏ/vàng nhỏ ở góc nếu cầu thủ đang dính thẻ hoặc chấn thương.
- **Thao tác:** Kéo thả linh hoạt trên màn hình Desktop; trên Mobile hỗ trợ chạm để chọn vị trí thay thế, không bắt buộc thao tác kéo thả phức tạp.

## 10. Yêu cầu phi chức năng

Các ngưỡng dưới đây là **mục tiêu kiểm thử đề xuất**, chưa phải số đo thực tế.

| Mã | Yêu cầu và cách đo |
| --- | --- |
| NFR-01 | API đọc thường có p95 ≤ 500 ms; API ghi thường p95 ≤ 1.000 ms, đo tại backend, không gồm upload ảnh/dịch vụ bên ngoài |
| NFR-02 | Đo trên staging có cấu hình được ghi trong báo cáo, dữ liệu 300 cầu thủ, 10 mùa, 2.000 trận, 100.000 sự kiện; 50 người dùng đồng thời trong 10 phút; tỷ lệ lỗi hệ thống < 1% |
| NFR-03 | Dashboard dùng được trong ≤ 3 giây ở điều kiện thử nghiệm ghi rõ thiết bị, mạng và cache; phân trang tại server |
| NFR-04 | Toàn bộ API ghi có xác thực, phân quyền, validation phía server và kiểm tra trường cho phép |
| NFR-05 | Mật khẩu tối thiểu 10 ký tự; từ chối đầu vào vượt 72 byte UTF-8 khi dùng bcryptjs; không cắt ngầm mật khẩu; tham số băm được đo trên máy triển khai |
| NFR-06 | Access token đề xuất 15 phút, giữ trong bộ nhớ frontend; refresh token 7 ngày trong cookie HttpOnly/Secure, được xoay vòng và lưu hash phía server; access token chứa định danh phiên, backend kiểm tra phiên còn hiệu lực và tài khoản hoạt động trên mỗi request |
| NFR-07 | Có thu hồi phiên; endpoint dùng cookie có bảo vệ CSRF phù hợp, kiểm tra Origin, CORS danh sách cho phép và SameSite theo cấu hình domain thực tế |
| NFR-08 | Giới hạn đăng nhập đề xuất 5 lần thất bại/15 phút theo tài khoản kết hợp IP; giới hạn upload và API để giảm lạm dụng; log không chứa bí mật |
| NFR-09 | Ảnh JPG/PNG/WebP, tối đa 5 MB, tối đa 4.096 × 4.096 pixel; kiểm tra nội dung thực và giải mã ảnh, không chỉ tin phần mở rộng/MIME từ client; không nhận SVG trong MVP |
| NFR-10 | Sao lưu DB hằng ngày, lưu ít nhất 7 bản; mục tiêu RPO 24 giờ, RTO 4 giờ; phải thử khôi phục trước bàn giao. Ảnh cần chính sách phục hồi riêng, backup DB không thay thế backup ảnh |
| NFR-11 | Kiểm thử giao diện ở 360 px, 768 px, 1.440 px; Chrome, Edge, Firefox và Safari theo các phiên bản được ghi rõ trong đợt nghiệm thu |
| NFR-12 | Biến môi trường tách dev/staging/production; không commit secret; có health check, log requestId và cảnh báo lỗi máy chủ |

Phương án triển khai có thể giữ Vercel cho frontend và Render cho backend như bản gốc; cấu hình, chi phí, giới hạn dịch vụ và tên miền sẽ được xác minh khi triển khai. Không giả định gói miễn phí đáp ứng các mục tiêu hiệu năng hoặc sao lưu.

## 11. Kiểm thử và nghiệm thu

### 11.1. Tình huống nghiệm thu tối thiểu

| Mã | Tình huống | Kết quả mong đợi | Yêu cầu liên quan |
| --- | --- | --- | --- |
| AC-01 | Player gọi API sửa hồ sơ người khác | Bị từ chối; dữ liệu giữ nguyên | FR-A05, ma trận quyền |
| AC-02 | Tạo hai cầu thủ ACTIVE cùng số áo/cùng mùa | Bản ghi thứ hai bị từ chối, kể cả hai request đồng thời | BR-04 |
| AC-03 | Lưu đội hình 10 người rồi công bố | Lưu nháp được, công bố bị chặn | FR-L03 |
| AC-04 | Chọn người chấn thương hoặc bị đình chỉ trận | Không công bố được đội hình | BR-08 |
| AC-05 | Cho cầu thủ đã thay ra vào lại | Bị từ chối | BR-12 |
| AC-06 | Tỷ số 2–1 nhưng thiếu sự kiện ghi bàn | Không xác nhận kết quả; chỉ rõ thiếu dữ liệu | FR-M06, BR-17 |
| AC-07 | Chốt cùng trận hai lần | Thống kê chỉ tính một trận | FR-M06 |
| AC-08 | Mở lại, sửa và xác nhận trận | Thống kê loại bản cũ, tính bản mới đúng một lần | FR-M07 |
| AC-09 | Thẻ vàng thứ hai | Hai thẻ vàng và một lần truất quyền; không cộng thêm thẻ đỏ trực tiếp | BR-15, BR-16 |
| AC-10 | Chưa có trận hoặc chưa có dữ liệu chuyền | Không chia cho 0; tỷ lệ null, hiển thị trạng thái phù hợp | FR-S04 |
| AC-11 | Hai trận chuyền 9/10 và 10/20 | Tổng tỷ lệ 19/30 = 63,3%, không lấy trung bình 70% | Công thức thống kê |
| AC-12 | 2 PRESENT, 1 LATE, 1 ABSENT, 1 EXCUSED | Chuyên cần 75%; buổi hủy/chưa chốt không tính | FR-R05 |
| AC-13 | Hai HLV sửa cùng phiên bản | Lần lưu cũ bị trả 409; không mất cập nhật mới | Luồng xung đột |
| AC-14 | Upload file giả ảnh hoặc quá 5 MB | Bị từ chối; ảnh trước giữ nguyên | FR-P06, NFR-09 |
| AC-15 | Khóa tài khoản rồi gọi API bằng phiên cũ | Bị từ chối; refresh không cấp phiên mới | FR-A04, NFR-06 |
| AC-16 | Lưu trữ cầu thủ đã ghi bàn | Không được chọn mới; lịch sử và bàn thắng cũ giữ nguyên | FR-P05 |
| AC-17 | Cầu thủ vào sân dưới một phút, minutesPlayed=0 | Vẫn tính một lần ra sân khi played=true | BR-19 |
| AC-18 | Sửa mùa CLOSED hoặc đóng khi có trận chưa chốt | Bị chặn, hướng dẫn xử lý trạng thái phù hợp | FR-T04 |
| AC-19 | Công bố lịch rồi gửi lại cùng thao tác | Mỗi người nhận chỉ có một thông báo cho lần cập nhật đó | FR-N04 |
| AC-20 | Đối thủ phản lưới nhà | Tăng tỷ số đội; không cộng bàn thắng cá nhân cho cầu thủ đội | BR-14, BR-17 |
| AC-21 | Player gọi API xem lịch trận/kết quả nháp | Không trả nội dung nháp; dữ liệu công bố khác vẫn xem đúng quyền | FR-M08, BR-26 |
| AC-22 | Đóng mùa còn buổi tập chưa chốt | Bị chặn và chỉ rõ buổi cần xử lý | FR-T04 |
| AC-23 | Cầu thủ chấn thương sau công bố nhưng trước bắt đầu trận | Bắt đầu bị chặn; phải sửa và công bố lại đội hình | BR-25 |
| AC-24 | Sửa trận cũ khi cầu thủ hiện tại đang chấn thương | Dùng snapshot trận, không loại lịch sử ra sân | BR-25 |
| AC-25 | Đăng nhập với mật khẩu tạm rồi gọi API cầu thủ | Bị chặn đến khi đổi mật khẩu; phiên cũ hết hiệu lực sau đổi | Vòng đời tài khoản |
| AC-26 | Sửa điểm danh FINALIZED hoặc worker chạy lại cùng job | Sửa bị chặn; worker không tạo thông báo trùng | Mục 6.5, 6.6 |
| AC-27 | Đổi số áo rồi xem đội hình trận cũ | Trận cũ giữ số áo đã lưu; trận mới dùng số áo mới | BR-24 |
| AC-28 | Hai lịch [08:00,09:00) và [09:00,10:00) | Không cảnh báo trùng; đổi lịch sau bắt đầu 08:59 thì cảnh báo | BR-22 |

### 11.2. Cấp độ kiểm thử và điều kiện bàn giao

- Unit test cho công thức thống kê, điều kiện thi đấu, validation và chuyển trạng thái.
- Integration test cho API, phân quyền cấp bản ghi, unique index, transaction và xác nhận lặp.
- End-to-end cho luồng tạo cầu thủ → tạo trận → công bố đội hình → nhập kết quả → dashboard; tạo buổi tập → điểm danh → chuyên cần.
- Kiểm thử tải theo NFR-01 đến NFR-03; thử khôi phục backup theo NFR-10.
- Tất cả P0 và AC-01 đến AC-28 đạt; không còn lỗi làm mất dữ liệu, sai phân quyền hoặc sai kết quả thống kê. Lỗi giao diện nhỏ còn lại phải được liệt kê và thống nhất trước bàn giao.
- Bàn giao mã nguồn, `.env.example` không chứa secret, hướng dẫn cài đặt, seed dữ liệu giả lập, tài liệu API, hướng dẫn sử dụng, kết quả kiểm thử và quy trình backup/restore.

## 12. Lộ trình triển khai

| Giai đoạn | Công việc | Điều kiện hoàn thành |
| --- | --- | --- |
| 1. Chốt phạm vi | Xác nhận giả định, wireframe, mô hình dữ liệu, API | Có danh sách P0 và quyết định nghiệp vụ |
| 2. Nền tảng | Cấu trúc dự án, DB/index, đăng nhập, tài khoản, phân quyền, log | Truy cập theo vai trò đúng trước khi xây chức năng ghi |
| 3. Danh mục | Đội, mùa, đăng ký cầu thủ, hồ sơ, ảnh, đánh giá | Quản lý được danh sách theo mùa và ràng buộc số áo |
| 4. Thi đấu | Lịch, chiến thuật, đội hình, sự kiện, chốt/mở kết quả | Luồng trận hoàn chỉnh, tính nhất quán đạt kiểm thử |
| 5. Vận hành đội | Lịch tập, điểm danh, thông báo, dashboard | Số liệu và quyền đọc đúng theo vai trò |
| 6. Hoàn thiện | Responsive, Dark/Light, kiểm thử, backup, triển khai | Đạt tiêu chí nghiệm thu và đủ hồ sơ bàn giao |

Không ấn định thời lượng khi chưa biết số thành viên và hạn nộp. P1 đề xuất: xuất CSV/PDF, tự khôi phục mật khẩu, email/push, lịch sử đánh giá kỹ thuật dạng biểu đồ và thống kê nâng cao. Mở rộng đa đội, thể thức 5/7 người hoặc luật giải tự động cần đánh giá lại mô hình và nghiệp vụ.

## 13. Các điểm cần xác nhận trước khi triển khai thực tế

| Vấn đề | Mặc định trong tài liệu | Khi thay đổi cần xem lại |
| --- | --- | --- |
| Số đội | Một đội, nhiều mùa | Phân tách dữ liệu và quyền nếu đa đội |
| Thể thức | 11 người; không hiệp phụ/luân lưu | Đội hình, sự kiện và cách tính kết quả |
| Quyền cầu thủ | Xem hồ sơ bản thân, danh sách cơ bản và lịch đã công bố | Quyền riêng tư và API trả dữ liệu |
| Luật thay người | Không quay vòng, cấu hình số lượng theo trận | Các giới hạn theo giải và quy tắc sự kiện |
| Án treo giò | HLV nhập trận bị cấm | Tự động tính án theo từng giải |
| Chỉ số kỹ thuật | HLV đánh giá 1–99 | Nguồn nhập và tiêu chí chấm điểm |
| Số phút thi đấu | HLV kiểm tra và xác nhận | Tự động hóa đồng hồ và thời gian bù giờ |
| Chuyên cần | Đi muộn tính có tham gia; có phép loại mẫu số | Công thức và diễn giải báo cáo |
| Độ tuổi | Chưa giới hạn; chiều cao/cân nặng có khoảng đề xuất | Điều chỉnh cho đội thiếu nhi/thiếu niên |
| Vận hành | Backup hằng ngày; thông báo trong ứng dụng | Ngân sách, lưu giữ dữ liệu và kênh thông báo |

## 14. Tổng hợp chỉnh sửa so với bản ban đầu

| Điểm chưa đầy đủ | Nội dung đã hoàn thiện |
| --- | --- |
| Phạm vi “toàn diện/chuyên nghiệp” nhưng chưa có giới hạn | Xác định MVP, một đội/nhiều mùa, phạm vi loại trừ và giả định |
| Gộp Admin và HLV, chưa rõ Player được xem gì | Tách ba vai trò, quyền cấp bản ghi và vòng đời tài khoản |
| Tổng thống kê nằm trực tiếp trong Player | Chuyển nguồn thống kê sang dữ liệu trận đã xác nhận theo mùa |
| Thiếu schema tài khoản, đội hình, tập luyện | Bổ sung collection, quan hệ, chỉ mục và quy tắc toàn vẹn |
| Trạng thái chấn thương/cho mượn/treo giò bị gộp | Tách các trạng thái độc lập và điều kiện chọn cầu thủ |
| Chưa có quy tắc ghi bàn, thay người, thẻ và phản lưới | Bổ sung nghiệp vụ và kiểm tra trước chốt kết quả |
| Chỉ tiêu API < 200 ms không có điều kiện đo | Thay bằng mục tiêu p95 và kịch bản tải có thể kiểm chứng |
| Gọi băm mật khẩu là mã hóa | Sửa thuật ngữ và bổ sung quản lý phiên, thu hồi, bảo vệ API |
| Thiếu trường hợp lỗi, tiêu chí chấp nhận và bàn giao | Bổ sung luồng lỗi, API, nghiệm thu và lộ trình có điều kiện hoàn thành |

### Rà soát bổ sung ở phiên bản 1.2

- Thống nhất quyền xem bảng xếp hạng và quyền xem hồ sơ riêng tư.
- Bổ sung trạng thái công bố lịch, khóa/mở điểm danh và điều kiện đóng/mở mùa.
- Làm rõ thời gian trận, phạm vi dữ liệu đối thủ, tác động của thẻ đỏ và snapshot đội hình.
- Đồng bộ schema, endpoint, quản lý phiên, transaction và xử lý thông báo thử lại.
- Bổ sung kiểm tra dữ liệu bắt buộc, trùng lịch, lịch sử số áo và 8 tình huống nghiệm thu.

### Rà soát bổ sung ở phiên bản 1.3

- Chuẩn hóa hệ thống thiết kế giao diện (Design System & UI Vibe): định hướng phong cách Modern Athletic Tech, bảng màu Tailwind (Emerald / Slate / Semantic Sports Status), quy chuẩn kiểu chữ Typography và quy chuẩn mặt sân chiến thuật 2D Vector phẳng tối giản.

---

**Nguyên tắc triển khai:** dữ liệu trận đấu đã xác nhận là nguồn gốc của thống kê; mọi quyền đều được kiểm tra ở backend; thay đổi nghiệp vụ phải đồng bộ với mô hình dữ liệu, API và tiêu chí nghiệm thu.
