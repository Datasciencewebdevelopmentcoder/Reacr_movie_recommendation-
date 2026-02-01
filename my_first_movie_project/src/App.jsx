import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'


const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

console.log("My API Key is:", API_KEY); // <--- Add this

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [movieList, setMovieList] = useState([])
   const [isLoading, setIsLoading] = useState(false)

    const fetchMovies = async (query=null) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const url = query
                ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${BASE_URL}/discover/movie?sort_by=popularity.desc`
            const response = await fetch(url, options);
            
            if(!response.ok) {
               throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            if(data.results.length === 0) {
                setErrorMessage(data.Error || 'No movies found.');
                setMovieList([]);
                return;
            }
            // 2. Store data in state
            setMovieList(data.results || []);

        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to fetch movies. Please try again later.')
        }
        finally {
            setIsLoading(false);
        }
    } 

    useEffect(() => {
        // Create a timer to delay the fetch
        const delayDebounceFn = setTimeout(() => {
            fetchMovies(searchTerm);
        }, 500); // Waits 500ms (half a second) after user stops typing

        // Cleanup function: If user types again before 500ms, 
        // this cancels the previous timer and starts a new one.
        return () => clearTimeout(delayDebounceFn);
        
    }, [searchTerm]);

    return (
        <main>
            <div className='pattern' />

            <div className='wrapper'>
                <header>
                    <img src='./hero.png' alt='hero banner' />
                    <h1> Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                <section className='all-movies'>
                    <h2 className='mt-[40px]'>All movies</h2>
                    
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <ul>
                        {movieList.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                                
                    
                    ))}
                    </ul>
                    )}
                    
                   
                </section>
            </div>
        </main>
    )
}

export default App;