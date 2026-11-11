import type { BookDefinition, BookPageDefinition, HistoricalEvent, InfoCard } from '../types/book'
import { approvedSources, mediaManifest } from './mediaManifest'

type Spec = [string, string, string, string?]
const specs: Spec[] = [
 ['front-cover','30 NĂM KHẮC SỬ','Ba mươi năm biến động nhìn từ con người, chiến trường và bàn đàm phán.'],
 ['opening-title','30 năm khắc sử','Việt Nam 1945–1975 là hành trình qua những bước ngoặt làm thay đổi vận mệnh dân tộc. Trước mùa thu 1945, Chiến tranh thế giới thứ hai đi đến hồi kết; Nhật đảo chính Pháp rồi đầu hàng Đồng minh, tạo ra thời cơ đặc biệt cho cách mạng Việt Nam.'],
 ['opening-guide','Khám phá cuốn sách','9 chương với 30 trang nội dung dẫn người đọc từ Cách mạng tháng Tám đến mùa Xuân 1975. Chọn chương để đi nhanh; chạm các mốc, thẻ hoặc luận điểm để đọc phần giải thích.'],
 ['c1-august-revolution','Cách mạng tháng Tám 1945','Tháng Tám năm 1945, Nhật Bản đầu hàng Đồng minh, tạo thời cơ để Việt Minh phát động tổng khởi nghĩa. Chỉ trong thời gian ngắn, phong trào lan rộng trên cả nước, mở đường cho sự ra đời của nước Việt Nam Dân chủ Cộng hòa.','c1'],
 ['c1-declaration','Tuyên ngôn Độc lập và\nnhà nước mới','Ngày 2/9/1945 tại Ba Đình, Hồ Chí Minh tuyên bố thành lập nước Việt Nam Dân chủ Cộng hòa. Bản Tuyên ngôn khẳng định quyền độc lập qua 3 tầng lập luận: quyền phổ quát, căn cứ lịch sử và tuyên bố chính trị.','c1'],
 ['c1-challenges','Chính quyền giữa nhiều\nthử thách','Sau ngày độc lập, chính quyền mới phải đồng thời chống đói, chống mù chữ, giải quyết khó khăn tài chính và xây dựng nền tảng pháp lý. Tổng tuyển cử ngày 6/1/1946 và Quốc hội khóa I góp phần củng cố tính đại diện của nhà nước mới.','c1'],
 ['c1-diplomacy-ho','Ngoại giao năm 1946','Trước nhiều sức ép trong và ngoài nước, Hồ Chí Minh theo đuổi thương lượng nhằm giảm căng thẳng, tránh cùng lúc đối đầu nhiều lực lượng và tranh thủ thời gian củng cố chính quyền. Những bất đồng về chủ quyền cuối cùng vẫn không được giải quyết.','c1'],
 ['c2-nationwide-resistance','Toàn quốc kháng chiến','Ngày 19/12/1946, kháng chiến toàn quốc bùng nổ. Tại Hà Nội và nhiều đô thị, lực lượng Việt Nam chiến đấu nhằm kìm chân quân Pháp, tạo điều kiện cho cơ quan lãnh đạo và lực lượng kháng chiến rút về căn cứ. Cuộc chiến được xác định là lâu dài và dựa vào sức mạnh toàn dân.','c2'],
 ['c2-viet-bac','Việt Bắc 1947 và xây dựng\nlực lượng','Thu – Đông năm 1947, Pháp tiến công lên Việt Bắc nhằm đánh vào cơ quan lãnh đạo và lực lượng chủ lực nhưng không đạt mục tiêu. Sau thắng lợi phòng ngự, căn cứ, hậu phương và lực lượng vũ trang tiếp tục được củng cố trong những năm 1948–1949.','c2'],
 ['c3-international-1950','Năm 1950:\nbước chuyển quan trọng','Trung Quốc và Liên Xô công nhận nước Việt Nam Dân chủ Cộng hòa. Trong khi đó, Hoa Kỳ công nhận Quốc gia Việt Nam do Bảo Đại đứng đầu và bắt đầu viện trợ cho Pháp cùng các quốc gia liên kết. Cuộc chiến ở Đông Dương ngày càng gắn với cục diện Chiến tranh Lạnh.','c3'],
 ['c3-border-campaign','Chiến dịch Biên giới 1950','Tháng 9/1950, quân đội Việt Minh mở Chiến dịch Biên giới nhằm tiêu diệt một bộ phận lực lượng Pháp, khai thông tuyến biên giới Việt – Trung và mở rộng căn cứ địa Việt Bắc. Chiến dịch đánh dấu bước chuyển quan trọng trong khả năng chủ động tiến công.','c3'],
 ['c3-campaigns-homefront','Từ các chiến dịch 1951–1953 đến Kế hoạch Navarre','Sau chiến thắng Biên giới, Việt Minh mở các chiến dịch ở Trung du, Hòa Bình, Tây Bắc và Thượng Lào. Kinh nghiệm tác chiến và sức ép trên nhiều hướng làm thay đổi tương quan, buộc Pháp phân tán lực lượng và tìm một kế hoạch mới để giành lại thế chủ động.','c3'],
 ['c4-context','Điện Biên Phủ:\n2 chiến lược đối đầu','Pháp xây dựng Điện Biên Phủ thành tập đoàn cứ điểm dựa vào hỏa lực, sân bay và hệ thống phòng ngự. Việt Minh chuẩn bị hậu cần qua núi rừng, tổ chức bao vây và chuyển từ phương án đánh nhanh sang tiến công thận trọng, dài ngày.','c4'],
 ['c4-phase-one','Điện Biên Phủ: 56 ngày đêm','Từ ngày 13/3 đến 7/5/1954, quân đội Việt Minh tiến hành ba đợt tiến công. Qua từng giai đoạn, hệ thống phòng thủ của Pháp dần bị thu hẹp, dẫn đến cuộc tổng tiến công kết thúc chiến dịch.','c4'],
 ['c4-phase-two','Ngày 7/5/1954: Chiến thắng Điện Biên Phủ','Sau thời gian giằng co tại các cứ điểm phía đông, hệ thống chiến hào ngày càng áp sát khiến khả năng phòng thủ và tiếp tế của quân Pháp suy giảm. Chiều 7/5, sở chỉ huy tập đoàn cứ điểm bị chiếm, tạo sức ép quyết định trên bàn đàm phán Genève.','c4'],
 ['c4-geneva','Genève 1954: đình chiến và\ngiới tuyến tạm thời','Hội nghị Genève dẫn tới đình chỉ chiến sự, tập kết và chuyển quân. Giới tuyến gần vĩ tuyến 17 chỉ là ranh giới quân sự tạm thời, không phải biên giới quốc gia. Trang này mở Phần II bằng hệ quả trực tiếp của cuộc chiến chống Pháp.','c4'],
 ['c5-two-regions','Đất nước sau Genève','Sau năm 1954, hai miền phát triển theo những chương trình chính trị khác nhau. Miền Bắc khôi phục và xây dựng theo mô hình xã hội chủ nghĩa; ở miền Nam, Việt Nam Cộng hòa được Hoa Kỳ hậu thuẫn. Di cư, chia cắt và việc tổng tuyển cử dự kiến năm 1956 không diễn ra làm tình trạng tạm thời kéo dài.','c5'],
 ['c5-dong-khoi','Đồng khởi và sự ra đời của\nMặt trận','Từ năm 1959, đấu tranh chính trị kết hợp hoạt động vũ trang rõ hơn. Phong trào Đồng khởi nổi bật tại Bến Tre đầu năm 1960, làm suy yếu bộ máy chính quyền ở một số vùng nông thôn và tạo điều kiện cho sự ra đời của Mặt trận Dân tộc Giải phóng miền Nam ngày 20/12/1960.','c5'],
 ['c6-special-war','Chiến tranh đặc biệt','Hoa Kỳ tăng cố vấn, viện trợ và phương tiện, còn quân đội Việt Nam Cộng hòa giữ vai trò tác chiến chính. Chương trình Ấp chiến lược nhằm tách lực lượng nổi dậy khỏi cơ sở xã hội, nhưng cưỡng bức di chuyển, quản lý yếu và tranh chấp nông thôn làm bộc lộ nhiều giới hạn.','c6'],
 ['c6-events','Khủng hoảng năm 1963','Trận Ấp Bắc cho thấy lực lượng nổi dậy có thể chống lại một cuộc hành quân có ưu thế phương tiện. Cùng năm, đấu tranh Phật giáo làm sâu sắc khủng hoảng chính danh; cuộc đảo chính tháng 11 lật đổ Ngô Đình Diệm và mở ra giai đoạn bất ổn chính trị kéo dài.','c6'],
 ['c6-escalation','Chiến tranh leo thang 1964–1967','Sau sự kiện Vịnh Bắc Bộ, Hoa Kỳ mở rộng không kích và đưa lực lượng chiến đấu quy mô lớn vào miền Nam. Từ năm 1965, chiến tranh tiêu hao dựa vào cơ động và hỏa lực gia tăng tổn thất, nhưng không giải quyết được cuộc đấu giành ảnh hưởng chính trị và kiểm soát nông thôn.','c6'],
 ['c7-context','Tết Mậu Thân 1968','Cuối tháng 1/1968, lực lượng cộng sản tiến công đồng loạt tại Sài Gòn, Huế và nhiều địa điểm khác. Quy mô tiến công tạo bất ngờ, nhưng kỳ vọng nổi dậy rộng không diễn ra và phần lớn mục tiêu bị phía Mỹ cùng Việt Nam Cộng hòa tái chiếm.','c7'],
 ['c7-immediate','Vì sao Mậu Thân là bước ngoặt?','Về quân sự trước mắt, lực lượng tiến công không giữ được phần lớn mục tiêu và chịu tổn thất lớn. Về chính trị dài hạn, hình ảnh chiến sự làm suy giảm niềm tin của công chúng Mỹ, thúc đẩy hạn chế ném bom và mở đường cho tiến trình đàm phán Paris.','c7'],
 ['c8-vietnamization','Việt Nam hóa chiến tranh','Nixon rút dần quân Mỹ, tăng trang bị và trách nhiệm cho quân đội Việt Nam Cộng hòa, nhưng Hoa Kỳ vẫn duy trì không quân, viện trợ và sức ép ngoại giao. Chiến sự mở rộng sang Campuchia; Lam Sơn 719 tại Hạ Lào cho thấy khả năng tự tác chiến vẫn có giới hạn.','c8'],
 ['c8-1972','Năm 1972: chiến trường và ngoại giao','Cuộc tiến công quy mô lớn của phía cộng sản gặp phản công với hỏa lực mạnh của Mỹ và Việt Nam Cộng hòa. Không bên nào quyết định toàn cuộc chỉ bằng chiến trường; sức ép quân sự đồng thời thúc đẩy các kênh đàm phán công khai và bí mật tại Paris.','c8'],
 ['c8-accord','Hiệp định Paris 1973','Hiệp định ký ngày 27/1/1973 quy định ngừng bắn, rút quân Mỹ và đồng minh, trao trả người bị bắt và một tiến trình chính trị. Quân Mỹ rút nhưng các lực lượng Việt Nam vẫn giữ vị trí; giao tranh tiếp tục nên Hiệp định không đồng nghĩa chiến tranh chấm dứt.','c8'],
 ['c9-after-paris','Từ Paris đến Phước Long','Trong năm 1973–1974, hai phía tiếp tục tranh giành địa bàn trong khi viện trợ và khả năng Hoa Kỳ can thiệp trở lại suy giảm. Việc Phước Long thất thủ ngày 6/1/1975 mà không có can thiệp quân sự trực tiếp của Mỹ trở thành tín hiệu quan trọng để đánh giá thời cơ chiến lược.','c9'],
 ['c9-tay-nguyen','Chiến dịch Tây Nguyên 1975','Ngày 10/3/1975, đòn tiến công vào Buôn Ma Thuột làm rung chuyển thế phòng thủ Tây Nguyên. Quyết định rút quân sau đó dẫn tới hỗn loạn và tổn thất lớn, khiến kế hoạch chiến dịch ban đầu nhanh chóng phát triển thành thời cơ chiến lược trên toàn miền Nam.','c9'],
 ['c9-hue-danang','Từ Huế – Đà Nẵng đến Sài Gòn','Cuối tháng 3/1975, Huế và Đà Nẵng lần lượt nằm dưới quyền kiểm soát của lực lượng cách mạng. Sự tan rã nhanh của tuyến phòng thủ miền Trung thúc đẩy quyết định phát triển cuộc tiến công và chuẩn bị chiến dịch cuối cùng hướng vào Sài Gòn – Gia Định.','c9'],
 ['c9-hcm-campaign','Chiến dịch Hồ Chí Minh và ngày 30/4/1975','Từ 26 đến 30/4, các cánh quân tiến vào Sài Gòn – Gia Định. Trưa 30/4, chính quyền Việt Nam Cộng hòa đầu hàng, chiến tranh kết thúc. Thống nhất về mặt nhà nước là quá trình tiếp theo, với bầu cử Quốc hội chung và quyết định tên nước trong năm 1976.','c9'],
 ['ending-reflection','Nhìn lại 30 năm khắc sử','Ba mươi năm chiến tranh để lại độc lập, thống nhất nhưng cũng nhiều mất mát, di cư và ký ức khác nhau. Đọc lịch sử cần phân biệt kết quả quân sự, quyết định chính trị và hệ quả lâu dài; đồng thời luôn hỏi ai tạo tư liệu, vào lúc nào và chú thích có cùng nguồn với hình ảnh hay không.'],
 ['back-cover','30 NĂM KHẮC SỬ','Việt Nam 1945–1975']
]

const chapterRanges: Record<string, [number, number]> = { c1:[3,6], c2:[7,8], c3:[9,11], c4:[12,15], c5:[16,17], c6:[18,20], c7:[21,22], c8:[23,25], c9:[26,29] }
const event = (id:string,date:string,title:string,description:string):HistoricalEvent => ({id,date,title,description})
const card = (id:string,title:string,description:string):InfoCard => ({id,title,description})
const layouts: BookPageDefinition['layout'][] = ['cover','reading-instructions','toc','timeline','cards','story','timeline','strategy-tabs','story','cards','timeline','timeline','cards','timeline','story','schematic','comparison','timeline','strategy-tabs','timeline','timeline','timeline','comparison','cards','timeline','cards','timeline','timeline','timeline','timeline','reference','back-cover']

const mediaById: Record<string, string[]> = {
 'front-cover':['cover-tank-846'],
 'c1-declaration':['arch-1945-ba-dinh'],
 'c1-challenges':['arch-1945-literacy-class'],
 'c2-nationwide-resistance':['arch-1946-hanoi-partisans'],
 'c2-viet-bac':['arch-1948-vietbac'],
 'c3-international-1950':['arch-1950-us-aid'],
 'c3-campaigns-homefront':['arch-1953-highway','arch-1953-de-castries'],
 'c4-context':['arch-1954-valley','arch-1954-road'],
 'c4-phase-two':['arch-1954-trenches','arch-1954-dien-bien-flag'],
 'c4-geneva':['arch-1954-geneva','s11-geneva-map'],
 'c5-two-regions':['arch-1954-refugees'],
 'c6-special-war':['arch-1962-hamlet'],
 'c6-events':['arch-1963-diem'],
 'c6-escalation':['arch-1965-da-nang-landing','arch-1965-iadrang'],
 'c7-context':['arch-1968-saigon-tet'],
 'c8-vietnamization':['arch-1970-arvn'],
 'c8-1972':['arch-1972-b52','arch-1973-signatures'],
 'c8-accord':['s17-paris-table','arch-1973-thachhan'],
 'c9-after-paris':['arch-1975-phuoclong-map'],
 'c9-hcm-campaign':['arch-1975-okinawa','arch-1976-map'],
 'ending-reflection':['arch-1975-tank843','s20-memory-collage']
}

const eventsById: Record<string, HistoricalEvent[]> = {
 'c1-august-revolution':[
  {...event('a1','19/8/1945','Khởi nghĩa giành chính quyền tại Hà Nội','Ngày 19/8, đông đảo quần chúng tham gia mít tinh và biểu tình tại Hà Nội. Lực lượng cách mạng giành quyền kiểm soát các cơ quan quan trọng của chính quyền.'),significance:'Thắng lợi tại Hà Nội tạo động lực mạnh mẽ cho tổng khởi nghĩa trên cả nước.'},
  {...event('a2','23/8/1945','Khởi nghĩa giành chính quyền tại Huế','Ngày 23/8, cuộc khởi nghĩa thắng lợi tại Huế, trung tâm của triều đình nhà Nguyễn.'),significance:'Thắng lợi làm thay đổi sâu sắc tình hình chính trị tại kinh đô.'},
  {...event('a3','25/8/1945','Khởi nghĩa giành chính quyền tại Sài Gòn','Ngày 25/8, đông đảo quần chúng xuống đường, đánh dấu thắng lợi giành chính quyền ở đô thị trung tâm Nam Bộ.'),significance:'Phong trào tổng khởi nghĩa lan rộng từ Bắc vào Nam.'},
  {...event('a4','30/8/1945','Vua Bảo Đại tuyên bố thoái vị','Tại Ngọ Môn, vua Bảo Đại trao lại ấn và kiếm, chấm dứt triều Nguyễn với tư cách triều đại cầm quyền.'),significance:'Chế độ quân chủ kết thúc, mở sang một thời kỳ chính trị mới.'}
 ],
 'c1-diplomacy-ho':[
  event('h1','6/3/1946','Hiệp định Sơ bộ','Pháp công nhận Việt Nam là một quốc gia tự do trong Liên hiệp Pháp; Việt Nam đồng ý cho quân Pháp ra miền Bắc thay quân Trung Hoa Dân quốc. Thỏa thuận giúp giảm sức ép trước mắt.'),
  event('h2','14/9/1946','Tạm ước Việt – Pháp','Sau khi Hội nghị Fontainebleau không đạt thỏa thuận, Tạm ước xử lý một số vấn đề kinh tế, văn hóa và tiếp tục kéo dài hòa hoãn.'),
  event('h3','Cuối 1946','Khả năng hòa hoãn thu hẹp','Xung đột tại Hải Phòng và Hà Nội cùng các yêu sách quân sự khiến giải pháp thương lượng ngày càng khó duy trì.')
 ],
 'c3-border-campaign':[
  event('b1','16–18/9/1950','Trận Đông Khê','Việt Minh chiếm Đông Khê, chia cắt tuyến phòng thủ và đặt lực lượng Pháp tại Cao Bằng vào thế khó khăn.'),
  event('b2','Cuối 9 – đầu 10/1950','Đường số 4','Các cánh quân Pháp rút từ Cao Bằng và tiến từ Thất Khê bị bao vây, chặn đánh; kế hoạch hội quân thất bại.'),
  event('b3','Tháng 10/1950','Kết quả','Pháp rút khỏi nhiều vị trí; biên giới Việt – Trung được khai thông và căn cứ Việt Bắc được củng cố.')
 ],
 'c3-campaigns-homefront':[
  event('p1','1951','Trung du và Hòa Bình','Các trận đánh cho thấy hạn chế khi tiến công vào địa hình, công sự có lợi cho Pháp; chiến dịch Hòa Bình giúp tích lũy thêm kinh nghiệm.'),
  event('p2','1952–1953','Tây Bắc và Thượng Lào','Các chiến dịch mở rộng vùng kiểm soát và gây sức ép lên hệ thống phòng thủ Pháp.'),
  event('p3','1953','Kế hoạch Navarre','Việt Minh tiến công nhiều hướng, buộc Pháp phân tán lực lượng và làm suy giảm khả năng tập trung theo kế hoạch Navarre.')
 ],
 'c4-phase-one':[
  event('d1','13–17/3/1954','Đợt I','Việt Minh đánh chiếm Him Lam, Độc Lập và làm tan rã lực lượng tại Bản Kéo, phá vỡ vòng ngoài phía bắc.'),
  event('d2','30/3–30/4/1954','Đợt II','Giao tranh ác liệt tại phía đông và trung tâm; chiến hào áp sát, vòng vây ngày càng siết chặt.'),
  event('d3','1–7/5/1954','Đợt III','Tổng tiến công cuối cùng; chiều 7/5 sở chỉ huy bị chiếm và Christian de Castries bị bắt.')
 ],
 'c5-dong-khoi':[
  event('k1','1959','Chuyển hướng đấu tranh','Đấu tranh chính trị kết hợp hoạt động vũ trang rõ hơn.'),
  event('k2','Đầu 1960','Đồng khởi Bến Tre','Phong trào nổi bật tại nhiều xã, làm suy yếu bộ máy chính quyền ở một số vùng.'),
  event('k3','20/12/1960','Thành lập Mặt trận','Mặt trận Dân tộc Giải phóng miền Nam trở thành một chủ thể chính trị và quân sự quan trọng.')
 ],
 'c6-events':[
  event('e1','2/1/1963','Ấp Bắc','Lực lượng nổi dậy chống lại cuộc hành quân có ưu thế phương tiện.'),
  event('e2','Giữa 1963','Khủng hoảng Phật giáo','Đấu tranh làm sâu sắc khủng hoảng chính danh của chính quyền Ngô Đình Diệm.'),
  event('e3','1/11/1963','Đảo chính','Ngô Đình Diệm bị lật đổ; các nhóm cầm quyền sau đó thay đổi nhanh, gây gián đoạn quản trị.')
 ],
 'c6-escalation':[
  event('x1','2/8/1964','Vịnh Bắc Bộ','Sự kiện và diễn giải sau đó mở đường cho thẩm quyền leo thang của Hoa Kỳ.'),
  event('x2','8/3/1965','Đà Nẵng','Lính thủy đánh bộ Mỹ đến, đánh dấu việc đưa lực lượng chiến đấu quy mô lớn vào miền Nam.'),
  event('x3','1965–1967','Chiến tranh tiêu hao','Hai bên tìm cách gây tổn thất, nhưng báo cáo quân sự không giải quyết được bế tắc chính trị.')
 ],
 'c7-context':[
  event('te1','Cuối 1/1968','Sài Gòn','Nhiều mục tiêu biểu tượng bị tiến công nhưng không được giữ lâu.'),
  event('te2','1–2/1968','Huế','Giao tranh kéo dài; thành phố trở thành một trong những chiến trường tiêu biểu.'),
  event('te3','Tết 1968','Toàn miền Nam','Tiến công đồng loạt tạo bất ngờ về quy mô và địa lý.')
 ],
 'c8-1972':[
  event('n1','1972','Chiến trường','Tiến công quy mô lớn gặp phản công với hỏa lực mạnh; không bên nào quyết định toàn cuộc.'),
  event('n2','1969–1972','Kênh bí mật','Lê Đức Thọ và Henry Kissinger tiến hành nhiều vòng thương lượng.'),
  event('n3','Cuối 1972','Trở lại bàn đàm phán','Sức ép quân sự và ngoại giao thúc đẩy các bên hoàn tất thỏa thuận.')
 ],
 'c9-after-paris':[
  event('ap1','1973–1974','Giao tranh tiếp tục','Hai phía tranh giành địa bàn trong khi tương quan viện trợ và khả năng can thiệp thay đổi.'),
  event('ap2','6/1/1975','Phước Long','Phước Long thất thủ mà Hoa Kỳ không can thiệp quân sự trực tiếp.'),
  event('ap3','Đầu 1975','Đánh giá thời cơ','Lãnh đạo phía bắc có thêm căn cứ đánh giá phản ứng và khả năng tiến công.')
 ],
 'c9-tay-nguyen':[
  event('t1','10/3/1975','Buôn Ma Thuột','Đòn tiến công làm rung chuyển thế phòng thủ Tây Nguyên.'),
  event('t2','Giữa tháng 3','Rút khỏi Tây Nguyên','Cuộc rút quân gây hỗn loạn và tổn thất lớn.'),
  event('t3','Cuối tháng 3','Thời cơ chiến lược','Kế hoạch chiến dịch phát triển nhanh hơn dự kiến.')
 ],
 'c9-hue-danang':[
  event('hd1','21–26/3/1975','Huế','Tuyến phòng thủ ở Trị Thiên – Huế tan rã.'),
  event('hd2','29/3/1975','Đà Nẵng','Đà Nẵng nằm dưới quyền kiểm soát của lực lượng cách mạng.'),
  event('hd3','Đầu 4/1975','Hướng vào Sài Gòn','Cục diện mới thúc đẩy chuẩn bị cho chiến dịch cuối cùng.')
 ],
 'c9-hcm-campaign':[
  event('hc1','26/4/1975','Mở chiến dịch','Năm hướng tiến công vào Sài Gòn – Gia Định.'),
  event('hc2','28–29/4','Áp sát trung tâm','Các tuyến phòng thủ ngoại vi lần lượt bị vượt qua.'),
  event('hc3','30/4/1975','Chính quyền đầu hàng','Dương Văn Minh tuyên bố đầu hàng; chiến tranh kết thúc.'),
  event('hc4','1976','Thống nhất nhà nước','Bầu Quốc hội chung và quyết định tên nước hoàn tất quá trình thống nhất về mặt nhà nước.')
 ]
}

const cardsById: Record<string, InfoCard[]> = {
 'c1-declaration':[
  {...card('d1','Quyền phổ quát','Hồ Chí Minh viện dẫn nguyên lý tự do và bình đẳng từ Tuyên ngôn Hoa Kỳ năm 1776 và Tuyên ngôn Nhân quyền và Dân quyền Pháp năm 1789, rồi mở rộng từ quyền con người sang quyền dân tộc.'),detailTitle:'Từ quyền con người đến quyền dân tộc',significance:'Độc lập được khẳng định như một quyền chính đáng của dân tộc.'},
  {...card('d2','Căn cứ lịch sử','Tuyên ngôn trình bày chính sách thuộc địa, biến động trong Chiến tranh thế giới thứ hai và quá trình nhân dân Việt Nam giành chính quyền.'),detailTitle:'Những bằng chứng từ thực tiễn lịch sử',significance:'Các sự kiện cụ thể củng cố cơ sở thực tiễn cho tuyên bố độc lập.'},
  {...card('d3','Tuyên bố chính trị','Văn kiện tuyên bố chấm dứt quan hệ thuộc địa, xác lập một quốc gia độc lập và sự ra đời của nước Việt Nam Dân chủ Cộng hòa.'),detailTitle:'Khẳng định nền độc lập của Việt Nam',significance:'Ngày 2/9/1945 đánh dấu sự ra đời của nhà nước mới.'}
 ],
 'c2-nationwide-resistance':[
  {...card('s1','Toàn dân','Kháng chiến cần sự tham gia của người chiến đấu, người sản xuất, vận chuyển và bảo vệ hậu phương.'),detailTitle:'Kháng chiến toàn dân'},
  {...card('s2','Toàn diện','Cuộc chiến được tiến hành trên các mặt quân sự, chính trị, kinh tế, văn hóa và ngoại giao.'),detailTitle:'Kháng chiến toàn diện'},
  {...card('s3','Trường kỳ','Kháng chiến lâu dài giúp bảo toàn lực lượng, xây dựng hậu phương và từng bước thay đổi tương quan.'),detailTitle:'Kháng chiến trường kỳ'},
  {...card('s4','Dựa vào sức mình','Nguồn lực trong nước giữ vai trò chính, đồng thời Việt Nam vẫn tranh thủ sự đồng tình và giúp đỡ quốc tế.'),detailTitle:'Phát huy nội lực'}
 ],
 'c2-viet-bac':[
  card('v1','Mục tiêu Pháp','Đánh vào cơ quan đầu não, tiêu diệt lực lượng chủ lực và tìm cách kết thúc chiến tranh nhanh.'),
  card('v2','Kết quả 1947','Quân Pháp rút lui; cơ quan lãnh đạo và lực lượng kháng chiến được bảo toàn.'),
  card('v3','Chuẩn bị 1948–1949','Nhân dân duy trì sản xuất, vận chuyển và hậu cần; lực lượng chủ lực, địa phương và dân quân từng bước được củng cố.')
 ],
 'c3-international-1950':[
  {...card('i1','Trung Quốc và Liên Xô','Tháng 1/1950, hai nước công nhận và thiết lập quan hệ ngoại giao với Việt Nam Dân chủ Cộng hòa.'),detailTitle:'Việt Nam Dân chủ Cộng hòa được công nhận'},
  {...card('i2','Hoa Kỳ viện trợ cho Pháp','Hoa Kỳ công nhận Quốc gia Việt Nam do Bảo Đại đứng đầu và tăng viện trợ quân sự, kinh tế cho phía Pháp cùng các quốc gia liên kết.'),detailTitle:'Hoa Kỳ hỗ trợ phía Pháp'},
  {...card('i3','Chiến tranh Lạnh','Cuộc chiến giành độc lập của Việt Nam đồng thời chịu ảnh hưởng ngày càng lớn của đối đầu quốc tế.'),detailTitle:'Đông Dương trong bối cảnh quốc tế mới'}
 ],
 'c3-campaigns-homefront':[
  card('nv1','Kế hoạch Navarre','Pháp dự định xây dựng lực lượng cơ động mạnh, giành lại thế chủ động và tìm một thắng lợi quân sự quyết định.'),
  card('nv2','Phá thế tập trung','Các cuộc tiến công của Việt Minh trên nhiều hướng buộc Pháp điều quân đối phó, làm suy giảm khả năng tập trung.'),
  card('nv3','Điện Biên Phủ','Tháng 11/1953, Pháp đổ quân xuống Điện Biên Phủ và dần xây dựng nơi đây thành tập đoàn cứ điểm.')
 ],
 'c4-context':[
  card('ct1','Tính toán của Pháp','Dựa vào hỏa lực, sân bay và hệ thống cứ điểm để buộc đối phương đánh theo điều kiện bất lợi.'),
  card('ct2','Chuẩn bị của Việt Minh','Mở đường, vận chuyển lương thực, kéo pháo và xây dựng hệ thống hậu cần qua núi rừng.'),
  card('ct3','Đổi cách đánh','Võ Nguyên Giáp chuyển từ đánh nhanh sang chuẩn bị thận trọng và siết vây lâu dài.')
 ],
 'c4-geneva':[
  card('g1','Đình chiến','Các văn kiện quy định ngừng bắn, tập kết và chuyển quân.'),
  card('g2','Giới tuyến tạm thời','Đường gần vĩ tuyến 17 là giới tuyến quân sự, không phải biên giới quốc gia.'),
  card('g3','Hệ quả','Hai vùng tập kết hình thành; tổng tuyển cử dự kiến năm 1956 không diễn ra.')
 ],
 'c5-two-regions':[
  card('m1','Miền Bắc','Khôi phục, cải cách và xây dựng theo mô hình xã hội chủ nghĩa.'),
  card('m2','Miền Nam','Việt Nam Cộng hòa được Hoa Kỳ hậu thuẫn và củng cố bộ máy.'),
  card('m3','Đời sống','Di cư, chia cắt gia đình và chính sách khác nhau tác động sâu đến xã hội.')
 ],
 'c5-dong-khoi':[
  card('nl1','Đồng khởi','Phong trào kết hợp nổi dậy quần chúng với hoạt động vũ trang, nổi bật tại Bến Tre.'),
  card('nl2','Bước chuyển','Phong trào cách mạng miền Nam chuyển sang thế tiến công rõ hơn.'),
  card('nl3','Mặt trận','Mặt trận tập hợp lực lượng chống chính quyền Ngô Đình Diệm và trở thành một chủ thể chính trị, quân sự.')
 ],
 'c6-special-war':[
  card('sw1','Cố vấn và viện trợ','Hoa Kỳ tăng cố vấn, trang bị và hỗ trợ cơ động; quân đội Việt Nam Cộng hòa tác chiến chính.'),
  card('sw2','Ấp chiến lược','Chương trình tổ chức lại cư dân nhằm tách lực lượng nổi dậy khỏi cơ sở xã hội.'),
  card('sw3','Giới hạn','Cưỡng bức di chuyển, quản lý yếu và tranh chấp nông thôn tạo phản ứng và làm lộ giới hạn chiến lược.')
 ],
 'c7-immediate':[
  card('im1','Kết quả quân sự','Phần lớn mục tiêu bị tái chiếm; kỳ vọng nổi dậy rộng không diễn ra và lực lượng tiến công chịu tổn thất lớn.'),
  card('im2','Tác động chính trị','Niềm tin của công chúng Mỹ suy giảm, thúc đẩy thay đổi chính sách.'),
  card('im3','Đàm phán','Johnson hạn chế ném bom; tiếp xúc Paris bắt đầu trong khi chiến tranh tiếp diễn.')
 ],
 'c8-vietnamization':[
  card('vz1','Rút quân Mỹ','Nixon giảm dần lực lượng bộ binh Mỹ nhưng không chấm dứt toàn bộ hỗ trợ.'),
  card('vz2','Chuyển trách nhiệm','Quân đội Việt Nam Cộng hòa nhận thêm trang bị và nhiệm vụ tác chiến.'),
  card('vz3','Chiến tranh mở rộng','Campuchia 1970 và Lam Sơn 719 cho thấy phạm vi chiến tranh mở rộng cùng giới hạn tự tác chiến.')
 ],
 'c8-accord':[
  card('ac1','Ngừng bắn','Quy định ngừng bắn và giữ vị trí lực lượng tại miền Nam.'),
  card('ac2','Rút quân và trao trả','Quân Mỹ, đồng minh rút; người bị bắt được trao trả theo cơ chế.'),
  card('ac3','Chiến sự tiếp tục','Các lực lượng Việt Nam vẫn ở lại và tiếp tục tranh chấp địa bàn sau khi hiệp định được ký.')
 ],
 'c9-hcm-campaign':[
  card('hf1','Chỉ huy chiến dịch','Văn Tiến Dũng chỉ huy chiến dịch; Võ Nguyên Giáp tham gia chỉ đạo chiến lược từ Bộ Tổng tư lệnh.'),
  card('hf2','Ngày 30/4','Dương Văn Minh tuyên bố đầu hàng, khép lại chính quyền Việt Nam Cộng hòa.'),
  card('hf3','Từ 1975 đến 1976','Chiến tranh kết thúc trước khi bầu cử Quốc hội chung và thống nhất nhà nước hoàn tất.')
 ],
 'ending-reflection':[
  card('q1','Bước ngoặt','1945, 1950, 1954, 1968, 1973 và 1975–1976 cho thấy thay đổi quân sự và chính trị không luôn diễn ra cùng lúc.'),
  card('q2','Ký ức và hòa bình','Hòa bình không xóa mất mát; đọc lịch sử cần đặt các ký ức khác nhau cạnh nhau.'),
  card('q3','Đọc nguồn','Cần kiểm tra tác giả, niên đại, nơi lưu trữ, chú thích, quyền sử dụng và phân biệt ảnh lưu trữ với minh họa.')
 ]
}

const chapterStarts = [
 ['C1 · Một nước Việt Nam mới','c1-august-revolution'],
 ['C2 · Toàn quốc kháng chiến','c2-nationwide-resistance'],
 ['C3 · Thay đổi cục diện','c3-international-1950'],
 ['C4 · Điện Biên Phủ và Genève','c4-context'],
 ['C5 · Đất nước sau Genève','c5-two-regions'],
 ['C6 · Chiến tranh mở rộng','c6-special-war'],
 ['C7 · Bước ngoặt Mậu Thân','c7-context'],
 ['C8 · Từ chiến trường đến bàn đàm phán','c8-vietnamization'],
 ['C9 · Mùa Xuân 1975','c9-after-paris'],
 ['Kết sách','ending-reflection']
] as const

const partForIndex = (index:number) => index < 3 ? 'opening' : index < 15 ? 'part-1' : index < 30 ? 'part-2' : 'ending'
const pages: BookPageDefinition[] = specs.map(([id,title,body,chapterId], index) => ({
 id,title,body,chapterId,partId:partForIndex(index),layout:layouts[index],
 subtitle:id==='front-cover'||id==='back-cover'?'Việt Nam 1945–1975':undefined,
 eyebrow:index>=3&&index<30?`CHƯƠNG ${chapterId?.slice(1)}`:undefined,
 ...(index>0&&index<31?{spreadId:`S${String(Math.ceil(index/2)).padStart(2,'0')}`,side:index%2?'L' as const:'R' as const}:{}),
 mediaIds:mediaById[id],events:eventsById[id],cards:cardsById[id],
 editorialSections:id==='c1-challenges'?[{title:'Cứu đói và tài chính',body:'Chính quyền phát động tăng gia, tiết kiệm, cứu trợ và các hình thức đóng góp tự nguyện để vượt khó.'},{title:'Bình dân học vụ',body:'Các lớp học đưa chữ Quốc ngữ đến đông đảo người dân, mở rộng khả năng tham gia xã hội.'},{title:'Xây dựng thể chế',body:'Tổng tuyển cử 6/1/1946 và Quốc hội khóa I củng cố nền tảng chính trị, pháp lý.'}]:id==='c2-viet-bac'?[{title:'Việt Bắc 1947',body:'Cuộc tiến công của Pháp không đạt mục tiêu; cơ quan lãnh đạo và lực lượng kháng chiến được bảo toàn.'},{title:'1948–1949',body:'Căn cứ, sản xuất, hậu cần và lực lượng vũ trang tiếp tục được củng cố.'}]:undefined,
 tagline:id==='c4-phase-two'?'Thắng lợi Điện Biên Phủ làm phá sản điểm tựa của kế hoạch Navarre và tạo sức ép quyết định tại Hội nghị Genève.':id==='c9-hcm-campaign'?'Ngày 30/4/1975 kết thúc chiến tranh; quá trình thống nhất nhà nước hoàn tất trong năm 1976.':undefined,
 ...(id==='opening-guide'?{actions:chapterStarts.map(([label,pageId])=>({label,pageId}))}:{}),
 ...(id==='c3-border-campaign'?{sources:approvedSources.filter(s=>s.id==='museum-border')}:{}),
 ...(id==='c3-campaigns-homefront'?{sources:approvedSources.filter(s=>s.id==='museum-navarre')}:{}),
 ...(id==='c4-phase-one'?{sources:approvedSources.filter(s=>s.id==='dienbien-phase-one'||s.id==='dienbien-phase-two')}:{}),
 ...(id==='c4-geneva'?{sources:approvedSources.filter(s=>s.id==='frus-geneva'||s.id==='mofa-geneva')}:{}),
 ...(id.startsWith('c6-')||id.startsWith('c7-')||id.startsWith('c8-')?{sources:approvedSources.filter(s=>s.id==='office-historian-guide')}:{}),
 ...(id==='c9-tay-nguyen'?{sources:approvedSources.filter(s=>s.id==='museum-tay-nguyen')}:{}),
 ...(id==='c9-hue-danang'?{sources:approvedSources.filter(s=>s.id==='museum-hue-danang')}:{}),
 ...(id==='c9-hcm-campaign'?{sources:approvedSources.filter(s=>s.id==='museum-hcm')}:{}),
 
}))

const orderedFigureMediaIds = Array.from(new Set(pages.slice(1).flatMap(page => page.mediaIds ?? []).filter(mediaId => {
 const asset = mediaManifest.find(item => item.id === mediaId)
 return asset?.recordType === 'asset' && Boolean(asset.localPath) && asset.kind !== 'video'
})))
export const figureNumberByMediaId = new Map(orderedFigureMediaIds.map((mediaId,index)=>[mediaId,index+1]))
const pageIds=(a:number,b:number)=>pages.slice(a,b+1).map(page=>page.id)
const chapters = [
 ['c1','Một nước Việt Nam mới','1945–1946','part-1'],
 ['c2','Toàn quốc kháng chiến','1946–1949','part-1'],
 ['c3','Thay đổi cục diện','1950–1953','part-1'],
 ['c4','Điện Biên Phủ và Genève','1953–1954','part-1'],
 ['c5','Đất nước sau Genève','1954–1960','part-2'],
 ['c6','Chiến tranh mở rộng','1961–1967','part-2'],
 ['c7','Bước ngoặt Mậu Thân','1968','part-2'],
 ['c8','Từ chiến trường đến bàn đàm phán','1969–1974','part-2'],
 ['c9','Mùa Xuân 1975','1975–1976','part-2']
].map(([id,title,period,partId])=>({id,title,period,partId,partIds:id==='c4'?['part-1','part-2']:undefined,pageIds:pageIds(...chapterRanges[id])}))

export const bookDefinition: BookDefinition = {
 id:'30-nam-khac-su',title:'30 NĂM KHẮC SỬ',eyebrow:'SÁCH LỊCH SỬ TƯƠNG TÁC',period:'Việt Nam 1945–1975',pages,chapters,
 parts:[
  {id:'opening',title:'Mở đầu',period:'Bìa và dẫn nhập',pageIds:pageIds(0,2)},
  {id:'part-1',title:'Phần I',period:'Kháng chiến chống Pháp · 1945–1954',pageIds:pageIds(3,14)},
  {id:'part-2',title:'Phần II',period:'Kháng chiến chống Mỹ · 1954–1975',pageIds:pageIds(15,29)},
  {id:'ending',title:'Kết sách',period:'Nhìn lại',pageIds:pageIds(30,31)}
 ]
}

export function validateBookDefinition(book:BookDefinition=bookDefinition){
 const errors:string[]=[];const ids=book.pages.map(p=>p.id);const idSet=new Set(ids)
 if(ids.length!==32||book.pages.slice(1,31).length!==30)errors.push('Cần đúng 32/30 trang')
 if(idSet.size!==32)errors.push('ID trang không duy nhất')
 if(book.pages[0].layout!=='cover'||book.pages[31].layout!=='back-cover'||book.pages.slice(1,31).some(p=>p.layout==='cover'||p.layout==='back-cover'))errors.push('Sai vị trí bìa')
 const spreads=new Set<string>();book.pages.slice(1,31).forEach((p,o)=>{const i=o+1;spreads.add(p.spreadId??'');if(p.side!==(i%2?'L':'R')||p.spreadId!==`S${String(Math.ceil(i/2)).padStart(2,'0')}`)errors.push(`Sai parity ${p.id}`)});if(spreads.size!==15)errors.push('Cần đúng 15 spread')
 const partRanges:[[string,number,number],[string,number,number],[string,number,number],[string,number,number]]=[['opening',0,2],['part-1',3,14],['part-2',15,29],['ending',30,31]]
 partRanges.forEach(([partId,a,b],i)=>{const part=book.parts[i];const expected=ids.slice(a,b+1);if(part?.id!==partId||part.pageIds.join('|')!==expected.join('|')||book.pages.slice(a,b+1).some(p=>p.partId!==partId))errors.push(`Sai range phần ${partId}`)})
 if(book.parts.length!==4)errors.push('Cần đúng 4 phần')
 const counts=[4,2,3,4,2,3,2,3,4];const assigned=new Set<string>()
 Object.entries(chapterRanges).forEach(([chapterId,[a,b]],i)=>{const chapter=book.chapters[i];const expected=ids.slice(a,b+1);if(chapter?.id!==chapterId||chapter.pageIds.length!==counts[i]||chapter.pageIds.join('|')!==expected.join('|'))errors.push(`Sai range chương ${chapterId}`);book.pages.slice(a,b+1).forEach(p=>{if(p.chapterId!==chapterId||assigned.has(p.id))errors.push(`Sai gán chương ${p.id}`);assigned.add(p.id)})})
 if(book.chapters.length!==9)errors.push('Cần đúng 9 chương')
 book.pages.forEach(p=>{if(p.layout==='timeline'&&!p.events?.length)errors.push(`Timeline rỗng ${p.id}`);if((p.layout==='cards'||p.layout==='strategy-tabs')&&!p.cards?.length)errors.push(`Cards rỗng ${p.id}`);if(p.layout==='toc'&&(!p.actions?.length||p.actions.some(a=>!a.pageId||!idSet.has(a.pageId))))errors.push(`TOC sai ${p.id}`)})
 const mids=new Set(mediaManifest.map(m=>m.id));book.pages.flatMap(p=>p.mediaIds??[]).forEach(id=>{if(!mids.has(id))errors.push(`Media ref ${id}`)})
 mediaManifest.forEach(m=>{if(m.lifecycleStatus==='legacy')return;m.pageIds.forEach(id=>{if(!idSet.has(id))errors.push(`Media page ${id}`)});if(m.permissionStatus==='reusable'&&(!m.localPath||!m.localPath.startsWith('/media/')))errors.push(`Local path ${m.id}`)})
 if(errors.length)throw new Error(errors.join('\n'))
 return {pages:32,interiors:30,spreads:15,parts:4,chapters:9,media:mediaManifest.length}
}
export const validationSummary=validateBookDefinition()
export const bookPages=pages
