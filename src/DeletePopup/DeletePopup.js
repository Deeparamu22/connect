import React from 'react'
import style from './DeletePopup.module.css'
export default function DeletePopup() {
    
  return (
    <div className={style.whole}>
        <h2>Delete this Comment</h2>
        <p className={style.youare}>You're about to delete this post. Are you sure you want to delete this comment</p>
        <div className={style.updatewhole}>
            <button className={style.sharbtn1}>Cancel</button>
            <button className={style.sharbtn}>Delete</button>
        </div>
    </div>
  )
}