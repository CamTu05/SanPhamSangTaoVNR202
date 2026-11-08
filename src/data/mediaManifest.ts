import type { HistoricalSource, MediaAsset } from '../types/book'

export const approvedSources: HistoricalSource[] = [
  { id:'mofa-history', title:'Bộ Ngoại giao, lịch sử Việt Nam', url:'https://mofa.gov.vn/lich-su1' },
  { id:'mofa-geneva', title:'Bộ Ngoại giao, về Genève', url:'https://mofa.gov.vn/tin-chi-tiet/chi-tiet/mot-moc-son-lich-su-cua-nen-ngoai-giao-viet-nam-48976-251.html' },
  { id:'museum-border', title:'Bảo tàng Lịch sử Quốc gia, Chiến dịch Biên giới', url:'https://baotanglichsu.vn/VI/Articles/3097/15060/cach-djay-63-nam-16-9-1950-14-10-1950-ta-mo-chien-dich-bien-gioi-thu-djong-chien-dich-le-hong-phong-ii.html' },
  { id:'dienbien-phase-one', title:'Bảo tàng Lịch sử Quốc gia, đợt I Điện Biên Phủ', url:'https://baotanglichsu.vn/VI/Articles/3097/72972/dot-1-chien-dich-dien-bien-phu.html', note:'Đối chiếu diễn biến đợt I; cần duyệt lại chi tiết trước xuất bản.' },
  { id:'dienbien-phase-two', title:'Bảo tàng Lịch sử Quốc gia, đợt II Điện Biên Phủ', url:'https://baotanglichsu.vn/VI/Articles/3097/72973/dot-2-chien-dich-dien-bien-phu.html', note:'Đối chiếu diễn biến đợt II; cần duyệt lại chi tiết trước xuất bản.' },
  { id:'museum-navarre', title:'Bảo tàng Lịch sử Quốc gia, kế hoạch Navarre', url:'https://baotanglichsu.vn/VI/Articles/3097/72965/ke-hoach-na-va.html' },
  { id:'museum-tay-nguyen', title:'Bảo tàng Lịch sử Quốc gia, Tây Nguyên', url:'https://baotanglichsu.vn/VI/Articles/3097/13884/tay-nguyen-chien-dich-mo-man-lich-su.html' },
  { id:'museum-hue-danang', title:'Bảo tàng Lịch sử Quốc gia, Huế–Đà Nẵng', url:'https://baotanglichsu.vn/VI/Articles/3097/13899/chien-dich-hue-dja-nang-21-3-djen-29-3-1975.html' },
  { id:'museum-hcm', title:'Bảo tàng Lịch sử Quốc gia, Chiến dịch Hồ Chí Minh', url:'https://baotanglichsu.vn/VI/Articles/3097/14153/chien-dich-ho-chi-minh-lich-su-26-4-30-4-1975.html' },
  { id:'frus-geneva', title:'FRUS, Geneva Conference, Document 1035', publisher:'Office of the Historian', url:'https://history.state.gov/historicaldocuments/frus1952-54v16/d1035' },
  { id:'office-historian-guide', title:'The Vietnam War, 1961–1975', publisher:'Office of the Historian', url:'https://history.state.gov/milestones/1961-1968/vietnam-war' }
]
const reusable = (id:string,pageIds:string[],displayPageId:string,localPath:string,description:string,kind:MediaAsset['kind']='illustration',sourceUrl?:string):MediaAsset => ({id,pageIds,displayPageId,kind,description,caption:description,source:sourceUrl?'Nguồn đã ghi trong hồ sơ asset':'Minh họa gốc của dự án History Ebook',sourceUrl,attribution:'History Ebook',license:sourceUrl?'Theo hồ sơ nguồn hiện có':'Tác phẩm gốc nội bộ, được phép tái sử dụng',permissionStatus:'reusable',verificationStatus:sourceUrl?'source-verified':'verified',localPath,lifecycleStatus:'active',recordType:'asset'})
const pending = (id:string,pageIds:string[],description:string):MediaAsset => ({id,pageIds,displayPageId:pageIds[0],kind:id.includes('map')?'map':'image',description,source:'Chưa cung cấp',attribution:'Đang cập nhật sau khi xác minh',license:'Chưa xác minh',permissionStatus:'pending',verificationStatus:'pending',localPath:null,lifecycleStatus:'active',recordType:'requirement'})
export const mediaManifest: MediaAsset[] = [
 reusable('cover-collage',['front-cover'],'front-cover','/media/cover-collage.svg','Bìa minh họa biên tập nguyên bản.'),
 reusable('s06-vietbac-map',['c2-viet-bac'],'c2-viet-bac','/media/s06-vietbac-map.svg','Sơ đồ giáo dục khái niệm về vai trò Việt Bắc.'),
 reusable('s07-border-map',['c3-border-campaign'],'c3-border-campaign','/media/s07-border-map.svg','Sơ đồ khái niệm Chiến dịch Biên giới.','illustration',approvedSources[2].url),
 reusable('s10-dienbien-map-stages',['c4-phase-one'],'c4-phase-one','/media/s10-dienbien-map-stages.svg','Sơ đồ khái niệm ba đợt Điện Biên Phủ.'),
 reusable('s11-geneva-map',['c5-geneva-aftermath'],'c5-geneva-aftermath','/media/s11-geneva-map.svg','Sơ đồ giới tuyến quân sự tạm thời, không phải biên giới quốc tế.','illustration',approvedSources[9].url),
 reusable('s14-strategy-icons',['c6-special-war'],'c6-special-war','/media/s14-strategy-icons.svg','Biểu tượng ba thành tố của chiến lược.'),
 reusable('s17-paris-table',['c8-accord'],'c8-accord','/media/vietnam-peace-agreement-signing.jpg','William Rogers ký Hiệp định Paris, 27/1/1973.','image','https://commons.wikimedia.org/wiki/File:Vietnam_peace_agreement_signing.jpg'),
 reusable('s18-spring-1975-map',['c9-tay-nguyen'],'c9-tay-nguyen','/media/s18-spring-1975-map.svg','Sơ đồ trình tự mùa xuân 1975.'),
 reusable('s20-memory-collage',['ending-reflection'],'ending-reflection','/media/s20-memory-collage.svg','Minh họa ký ức và hòa bình.'),
 pending('req-august-context',['opening-context'],'Cách mạng tháng Tám và bối cảnh trước 1945.'),
 pending('req-election-state',['c1-new-state'],'Tổng tuyển cử và nhà nước mới.'),
 pending('req-declaration-document',['c1-declaration'],'Bản Tuyên ngôn đã kiểm chứng để chú giải, không tự tạo trích dẫn.'),
 pending('req-resistance-document',['c2-nationwide-resistance'],'Tư liệu kháng chiến toàn quốc.'),
 pending('req-forces-1948',['c2-bases-forces'],'Căn cứ và lực lượng 1948–1949.'),
 pending('req-international-1950',['c3-international-1950'],'Bối cảnh quốc tế năm 1950.'),
 pending('req-campaigns-navarre',['c3-campaigns-homefront','c3-navarre'],'Các chiến dịch 1951–1953 và kế hoạch Navarre.'),
 pending('req-geneva-conference',['c4-geneva'],'Ảnh hoặc văn kiện Hội nghị Genève.'),
 pending('req-two-regions',['c5-two-regions'],'Tư liệu so sánh đời sống hai miền.'),
 pending('req-strategic-hamlet',['c6-hamlets'],'Tư liệu Ấp chiến lược.'),
 pending('req-political-us',['c6-instability','c6-escalation'],'Bất ổn chính trị và triển khai quân Mỹ.'),
 pending('req-war-tet',['c7-war-1965-67','c7-context','c7-events'],'1965–1967 và Mậu Thân.'),
 pending('req-vietnamization-1972',['c8-vietnamization','c8-1972'],'Việt Nam hóa và chiến sự 1972.'),
 pending('req-paris-document',['c8-negotiations','c8-accord'],'Văn kiện Paris để tóm tắt điều khoản.'),
 pending('req-post-paris',['c9-after-paris','c9-phuoc-long'],'Sau Paris và Phước Long.'),
 pending('req-reunification',['c9-reunification'],'Tư liệu bầu cử và quyết định nhà nước năm 1976.'),
 pending('req-ending-timeline',['ending-turning-points'],'Dòng thời gian bước ngoặt toàn sách.'),
 ...['s03-badinh','s04-literacy','s05-hanoi-1946','s08-civilian-life','s09-dienbien-logistics','s12-north-south-life','s13-ben-tre-map','s15-truongson-map','s16-tet-locations','s19-saigon-1975','video-s03-independence','video-s10-dienbien','video-s16-tet','video-s19-1975'].map(id => ({...pending(id,[],'Yêu cầu cũ được lưu để truy vết.'),displayPageId:undefined,legacyPageIds:['legacy-page'],lifecycleStatus:'legacy' as const}))
]
