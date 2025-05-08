import React from 'react'

function handelClick(){
    console.log("recall items")
}

const recall = () => {
  return (
    <button onClick={()=>handelClick()}>Recall</button>
  )
}

export default recall