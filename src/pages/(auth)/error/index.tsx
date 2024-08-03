import React from 'react'

const Index = () => {
  return (
    <div style={{padding:"25px"}}  >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="large-logo">
        <img
          src={"/assets/image/Group 9580.svg"}
          alt="Logo"
          height="50"
          width="177"
        />
        </div>
      </div>
      <h5 style={{marginTop:"25px"}}>
        No Account Found with requested domain
      </h5>
    </div>
  )
}

export default Index