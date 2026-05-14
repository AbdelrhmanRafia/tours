export const displayMap = (locations) => {
  // 1. تحديد مكان الخريطة (نفس الـ ID المستخدم في Mapbox)
  var map = L.map("map", { scrollWheelZoom: false });

  // 2. إضافة طبقة الخريطة المجانية (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // 3. إضافة العلامات (Markers) للمواقع
  const points = [];
  locations.forEach((loc) => {
    // إنشاء العلامة (لاحظ ترتيب الإحداثيات في Leaflet هو [lat, lng])
    const [lng, lat] = loc.coordinates;
    const marker = L.marker([lat, lng]).addTo(map);

    // إضافة Pop-up لكل موقع
    marker
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
      })
      .openPopup();
    points.push([lat, lng]);
  });

  // 4. ضبط زوم الخريطة ليشمل كل النقاط
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);
};
