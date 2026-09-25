import React from"react";
export default class ErrorBoundary extends React.Component{
 constructor(props){super(props);this.state={error:null}}
 static getDerivedStateFromError(error){return{error}}
 componentDidCatch(error,info){console.error("Parsayan UI error",error,info)}
 render(){if(!this.state.error)return this.props.children;return <main className="fatalScreen" dir="rtl"><div className="fatalCard"><span>پارسایان</span><h1>این صفحه گیر کرد؛ بازی از دست نرفته.</h1><p>یک خطای رابط کاربری رخ داد. صفحه را دوباره بارگذاری کن؛ بازی اصلی از حافظه دستگاه بازیابی می‌شود.</p><button type="button" onClick={()=>location.reload()}>بارگذاری دوباره</button><button type="button" className="fatalSecondary" onClick={()=>{try{localStorage.removeItem("parsayan_state_v15")}catch{}location.reload()}}>شروع تمیز</button></div></main>}
}
