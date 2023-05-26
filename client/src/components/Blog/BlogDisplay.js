export default function BlogDisplay() {

    // const { data } =  useQuery(ALL_SONGS);
    // const songList = data?.allSongs || [];
    // console.log(songList)

    return(

        <div id="blog-display-container">

            <h2>The Hush Puppy Blog</h2>
            
            {/* {songList && songList.map((song) => (
                <div key={song._id} className="col-12 col-xl-6">
                <div className="card mb-3">
                    
                    <h4 className="card-header bg-dark text-light p-2 m-0">
                    {song.name}
                    </h4>

                    <audio controls>
                        <source src={song.mp3Link} type="audio/mpeg" />
                    </audio>
                    
                </div>
                </div>
            ))} */}
        </div>
    );
};