import React from "react";

type Props = {};

const Rightpanel = (props: Props) => {
  return (
    <div>
      <div className="rpanel">
        <div className="rcard">
          <div className="rcard-ttl">
            Top Categories <a>View All</a>
          </div>
          <div className="cat-prog">
            <div className="cp-hdr">
              <span className="cp-name">Islamic</span>
              <span className="cp-val">1,245</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{width:"92%"}}></div>
            </div>
          </div>
          <div className="cat-prog">
            <div className="cp-hdr">
              <span className="cp-name">Anime</span>
              <span className="cp-val">1,198</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{width:"88%"}}></div>
            </div>
          </div>
          <div className="cat-prog">
            <div className="cp-hdr">
              <span className="cp-name">Nature</span>
              <span className="cp-val">1,156</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{width:"84%"}}></div>
            </div>
          </div>
          <div className="cat-prog">
            <div className="cp-hdr">
              <span className="cp-name">Superheroes</span>
              <span className="cp-val">1,089</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{width:"79%"}}></div>
            </div>
          </div>
          <div className="cat-prog">
            <div className="cp-hdr">
              <span className="cp-name">Minimalist</span>
              <span className="cp-val">986</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{width:"68%"}}></div>
            </div>
          </div>
          <div className="cat-prog">
            <div className="cp-hdr">
              <span className="cp-name">Cars</span>
              <span className="cp-val">874</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{width:"58%"}}></div>
            </div>
          </div>
        </div>

        <div className="rcard">
          <div className="rcard-ttl">
            Storage Usage <a>Details</a>
          </div>
          <div className="stor-hdr">
            <span className="stor-used">256.8 GB / 1 TB</span>
            <span className="stor-pct">25.1% Used</span>
          </div>
          <div className="stor-sub">774.2 GB remaining</div>
          <div className="stor-bg">
            <div className="stor-fill"></div>
          </div>
        </div>

        <div className="rcard">
          <div className="rcard-ttl">System Status</div>
          <div className="sys-ok">
            <div className="sys-dot"></div>All Systems Operational
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightpanel;
