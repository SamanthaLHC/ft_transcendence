import giphy from '../../assets/giphy.gif'
import './Banner.css'

function Banner() {
    const title = '~ Magical Ducky Pong ~'
    return (
        <div className='banner'>
            <img src={giphy} className='giphy'></img>
            <h1 className='title'>{title}</h1>
            <img src={giphy} className='giphy'></img>
        </div>
    )
}

export default Banner