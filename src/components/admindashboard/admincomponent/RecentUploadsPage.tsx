
'use client';
import DynamicTable from './DynamicTable';

const RecentUploadsPage = () => {
  const columns = [
    { header: 'Preview', accessor: (r: any) => <div className="thumb"><img src={r.img} /></div> },
    { header: 'Title', accessor: (r: any) => <><div className="wtitle">{r.title}</div><div className="wtags">{r.tags}</div></> },
    { header: 'Uploader', accessor: (r: any) => <><div className="uname">{r.user}</div><div className="uemail">{r.email}</div></> },
    { header: 'Category', accessor: (r: any) => <span className={`catb ${r.catClass}`}>{r.category}</span> },
    { header: 'Resolution', accessor: (r: any) => <span className="restext">{r.res}</span> },
    { header: 'Submitted', accessor: (r: any) => <><div className="ddate">{r.date}</div><div className="dtime">{r.time}</div></> },
    { header: 'Status', accessor: (r: any) => <span className="pend-tag">{r.status}</span> },
    { 
      header: 'Actions', 
      accessor: () => (
        <div className="acts">
          <button className="aapprove"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></button>
          <button className="areject"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          <button className="amore"><svg fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></button>
        </div>
      ) 
    }
  ];

  const data = [
    { 
      img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZTk2YzFlIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjN2EyZDAwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjM4IiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iMzIiIHk9IjI0IiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBvcGFjaXR5PSIwLjgiPvCfjIU8L3RleHQ+PC9zdmc+', 
      title: 'Ocean Sunset Vibes', 
      tags: '#nature #sunset', 
      user: 'ahmed.khan', 
      email: 'ahmed@email.com', 
      category: 'Nature', 
      catClass: 'cat-n', 
      res: '3840×2160', 
      date: 'May 15, 2025', 
      time: '10:30 AM', 
      status: 'Pending' 
    },
{
    img: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWUzYTVmIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGYxZjNkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjM4IiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iMzIiIHk9IjI0IiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBvcGFjaXR5PSIwLjgiPvCfj5TvuI88L3RleHQ+PC9zdmc+",
    title: "Minimalist Mountains",
    tags: "#minimalist #mountain",
    user: "sara.art",
    email: "saraart@email.com",
    category: "Minimalist",
    catClass: "cat-m",
    res: "3840×2160",
    date: "May 14, 2025",
    time: "11:45 PM",
    status: "Pending",
  },
  {
    img: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjN2MzNjAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNGExNTAwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjM4IiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iMzIiIHk9IjI0IiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBvcGFjaXR5PSIwLjgiPuKYqu+4jzwvdGV4dD48L3N2Zz4=",
    title: "Islamic Pattern Art",
    tags: "#islamic #pattern",
    user: "islamic.designs",
    email: "islamic.d@email.com",
    category: "Islamic",
    catClass: "cat-i",
    res: "3840×2160",
    date: "May 14, 2025",
    time: "08:20 PM",
    status: "Pending",
  },
  {
    img: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWExYTFhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOGIwMDAwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjM4IiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iMzIiIHk9IjI0IiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBvcGFjaXR5PSIwLjgiPvCfmpc8L3RleHQ+PC9zdmc+",
    title: "Supercar Dreams",
    tags: "#cars #supercar",
    user: "car.love",
    email: "carlove@email.com",
    category: "Cars",
    catClass: "cat-c",
    res: "3840×2160",
    date: "May 14, 2025",
    time: "06:10 PM",
    status: "Pending",
  },
  ];

  return <DynamicTable title="Recent Uploads" columns={columns} data={data} />;
};

export default RecentUploadsPage