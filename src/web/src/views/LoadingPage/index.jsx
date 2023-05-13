import React from 'react'
import './index.scss'

export default () => {
  return <div className="loading-container">
    <div className="wrap">
      <div className="apps">
        <div className="app yellow">
          <div className="top">
            <div className="fa fa-heart"></div>
          </div>
        </div>
        <div className="app red">
          <div className="top">
            <div className="fa fa-headphones"></div>
          </div>
        </div>
        <div className="app blue">
          <div className="top">
            <div className="fa fa-cutlery"></div>
          </div>
        </div>
        <div className="app green">
          <div className="top">
            <div className="fa fa-check"></div>
          </div>
        </div>
        <div className="app pink">
          <div className="top">
            <div className="fa fa-home"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
}