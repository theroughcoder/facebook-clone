import React, { useEffect, useRef, useState } from 'react'
import useClickOutSide from '../../helpers/clickOutSide'
import { Return, Search } from '../../svg'

export default function SearchMenu({ setShowSearchMenu }) {
    const color = "#65676b"
    const menu = useRef(null)
    const input = useRef(null)
    const [iconVisible, setIconVisible] = useState(true);

    useClickOutSide(menu, () => {
        setShowSearchMenu(false)
    })
    useEffect(()=>{
        input.current.focus()
    }, [])
    return (

        <div className='.header_left search_area scrollbars' ref={menu}>
            <div className='search_wrap'>
                <div className='header_logo'>
                    <div className='circle hover1' onClick={() => { setShowSearchMenu(false) }}>
                        <Return color={color} />
                    </div>

                </div>
                <div className='search' onClick={() => input.current.focus()}>
                    {iconVisible && <div> <Search color={color} /></div>}
                    <input type="text" placeholder='Search Facebook' ref={input} onFocus={()=> setIconVisible(false)} onBlur={()=>setIconVisible(true)}/>
                </div>
            </div>
            <div className='search_history_header'>
                <span>Recent searches</span>
                <a>Edit</a>
            </div>
            <div className='search_history'>
                <div className='search_result scrollbar'>

                </div>
            </div>
        </div>
    )
}
