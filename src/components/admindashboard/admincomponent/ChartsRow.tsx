



'use client';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type Props = {};

const ChartsRow = (props: Props) => {
  const dlChartRef = useRef<HTMLCanvasElement>(null);
  const donutChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dlChart: Chart | null = null;
    let donutChart: Chart | null = null;

    // Downloads line chart initialization
    if (dlChartRef.current) {
      const dlCtx = dlChartRef.current.getContext('2d');
      if (dlCtx) {
        const grad = dlCtx.createLinearGradient(0, 0, 0, 190);
        grad.addColorStop(0, 'rgba(5,223,139,0.22)');
        grad.addColorStop(1, 'rgba(5,223,139,0.0)');

        dlChart = new Chart(dlCtx, {
          type: 'line',
          data: {
            labels: Array.from({ length: 30 }, (_, i) => 'May ' + (i + 1)),
            datasets: [{
              label: 'Downloads',
              data: [7200, 8100, 9400, 8800, 11200, 10600, 9800, 10200, 9100, 8600, 9800, 12400, 14200, 16800, 18420, 16200, 14800, 15400, 14000, 13800, 12600, 12000, 11400, 12800, 11200, 12600, 13800, 14200, 15600, 15200],
              borderColor: '#05DF8B',
              borderWidth: 2,
              backgroundColor: grad,
              fill: true,
              tension: 0.42,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#05DF8B',
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#242A2B', borderColor: '#3A4245', borderWidth: 1,
                titleColor: '#8E9BA0', bodyColor: '#F0F4F5',
                titleFont: { size: 10 }, bodyFont: { size: 12,},
                padding: 10, cornerRadius: 8,
                callbacks: {
                  title: (c: any) => 'May ' + (c[0].dataIndex + 1) + ', 2025',
                  label: (c: any) => 'Downloads: ' + c.raw.toLocaleString(),
                }
              }
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'transparent' }, ticks: { color: '#576468', font: { size: 10 }, maxTicksLimit: 7 } },
              y: { grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'transparent' }, ticks: { color: '#576468', font: { size: 10 }, callback: (v: any) => v >= 1000 ? (v / 1000) + 'K' : v, maxTicksLimit: 6 }, min: 0, max: 25000 }
            }
          }
        });
      }
    }

    // Donut chart initialization
    if (donutChartRef.current) {
      donutChart = new Chart(donutChartRef.current, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [1245, 1782, 615],
            backgroundColor: ['#05DF8B', '#02A86A', '#1F4D37'],
            borderWidth: 0,
            hoverOffset: 5,
          }]
        },
        options: {
          responsive: false,
          cutout: '73%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#242A2B', borderColor: '#3A4245', borderWidth: 1,
              titleColor: '#8E9BA0', bodyColor: '#F0F4F5', cornerRadius: 8,
              callbacks: { label: (c: any) => ['Monthly', 'Yearly', 'Lifetime'][c.dataIndex] + ': ' + c.raw.toLocaleString() }
            }
          }
        }
      });
    }

    return () => {
      dlChart?.destroy();
      donutChart?.destroy();
    };
  }, []);

  return (
    <div>
      <div className="charts-row">
        <div className="card">
          <div className="card-hdr">
            <span className="card-ttl">Downloads Overview</span>
            <button className="card-btn">This Month <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></button>
          </div>
          <div className="dl-wrap"><canvas ref={dlChartRef} id="dlChart"></canvas></div>
        </div>

        <div className="card">
          <div className="card-hdr">
            <span className="card-ttl">Subscription Plans</span>
            <a className="vlink">View all</a>
          </div>
          <div className="donut-outer">
            <div className="donut-pos">
              <canvas ref={donutChartRef} id="donutChart" width="148" height="148"></canvas>
              <div className="donut-center">
                <div className="donut-num">3,642</div>
                <div className="donut-lbl">Total</div>
              </div>
            </div>
          <div className="leg-row">
              <div className="leg-l"><div className="leg-dot" style={{background:"#02A86A"}}></div>Yearly</div>
              <div className="leg-r">1,782 &nbsp;<span style={{color:"var(--text3)"}}>49.0%</span></div>
            </div>
            <div className="leg-row">
              <div className="leg-l"><div className="leg-dot" style={{background:"#1F4D37"}}></div>Lifetime</div>
              <div className="leg-r">615 &nbsp;<span style={{color:"var(--text3)"}}>16.8%</span></div>
            </div>
          </div>
        </div>
             <div className="card">
        <div className="card-hdr"><span className="card-ttl">Recent Activity</span></div>
        <div className="act-list">
          <div className="act-row">
            <div className="act-ico" style={{background:"rgba(5,223,139,.1)"}}><svg viewBox="0 0 24 24" fill="none" stroke="#05DF8B" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg></div>
            <div className="act-b"><div className="act-title">New wallpaper uploaded</div><div className="act-desc">Sunset in Tokyo.jpg</div><div className="act-time">2 min ago</div></div>
          </div>
          <div className="act-row">
            <div className="act-ico" style={{background:"rgba(99,102,241,.1)"}}><svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div className="act-b"><div className="act-title">New user registered</div><div className="act-desc">john.doe@email.com</div><div className="act-time">15 min ago</div></div>
          </div>
          <div className="act-row">
            <div className="act-ico" style={{background:"rgba(245,158,11,.1)"}}><svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <div className="act-b"><div className="act-title">New subscription</div><div className="act-desc">Yearly Plan – $19.99</div><div className="act-time">32 min ago</div></div>
          </div>
          <div className="act-row">
            <div className="act-ico" style={{background:"rgba(5,223,139,.1)"}}><svg viewBox="0 0 24 24" fill="none" stroke="#05DF8B" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div className="act-b"><div className="act-title">Wallpaper approved</div><div className="act-desc">Cyberpunk City 4K</div><div className="act-time">1 hour ago</div></div>
          </div>
          <div className="act-row">
            <div className="act-ico" style={{background:"rgba(239,68,68,.1)"}}><svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
            <div className="act-b"><div className="act-title">Payment received</div><div className="act-desc">$2.99 from sarah.wilson</div><div className="act-time">2 hours ago</div></div>
          </div>
        </div>
        <button className="see-all">View all activities</button>
      </div>
      </div>
    </div>
  );
};

export default ChartsRow;


