import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../../style/Header.css'
import {Friends, Gaming, HomeActive, Logo, Market, Menu, Search, Watch, Messenger, Notifications, ArrowDown} from "../../svg";
import {useSelector} from 'react-redux';
import SearchMenu from './SearchMenu';
export default function Header() {
    const color = "#65676b"
    const userInfo = useSelector((state)=>  state.user )
    const [showSearchMenu, setShowSearchMenu] = useState(false);
  return (
    
    <header>
        <div className='header_left'>
            <Link to="/" className='header_logo'>
                <div className='circle'>
                    <Logo/>
                </div>
            </Link>
                <div className='search search1' onClick={() => setShowSearchMenu(true) }>
                    <Search color={color}/>
                    <input
                        type="text"
                        placeholder='Search Facebook'
                        className='hide_input'
                    />
                </div>
        </div>
        {showSearchMenu && <SearchMenu setShowSearchMenu={setShowSearchMenu}/>}
        <div className='header_middle'>
            <Link to="/" className='middle_icon active'>
                <HomeActive/>
            </Link>
            <Link to="/" className='middle_icon hover1'>
                <Friends color={color}/>
            </Link>
            <Link to="/" className='middle_icon hover1 '>
                <Watch color={color}/>
                <div className='middle_notification'>9+</div>
            </Link>
            <Link to="/" className='middle_icon hover1'>
                <Market color={color}/>
            </Link>
            <Link to="/" className='middle_icon hover1'>
                <Gaming color={color}/>
            </Link>
        </div>
        <div className='header_right'>
            <Link to="/profile" className='profile_link hover1'>
                <img src={userInfo && userInfo.picture} alt=""/>
                <span>{userInfo && userInfo.first_name}</span>
            </Link>
            <div className='circle_icon hover1'>
                <Menu/>
            </div>
            <div className='circle_icon hover1'>
                <Messenger/>
            </div>
            <div className='circle_icon hover1'>
                <Notifications/>
                <div className='right_notification'>5</div>
            </div>
            <div className='circle_icon hover1'>
                <ArrowDown/>
            </div>
        </div>

    </header>
  )
}
