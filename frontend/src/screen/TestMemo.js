import React, { memo } from 'react'

function Testmemo() {
    console.log("okkk")
  return (
    <div>Testmemo</div>
  )
}

export default memo(Testmemo)