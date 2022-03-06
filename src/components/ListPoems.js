/* eslint-disable no-unused-vars */
import { useState } from "react"
import AsyncSelect from 'react-select/async'
import { 
  Container, Row, Col,
  Button, Tab, Tabs, 
  Card, Navbar, OverlayTrigger, 
  Popover 
} from "react-bootstrap"
import { FaHeart } from "react-icons/fa";

const ListPoems = () => {
  const [key, setKey] = useState('home');
  const [poems, setPoems] = useState([])
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [title, setTitle] = useState([])
  const [author, setAuthor] = useState([])
  const [favs, setFavs] = useState([])


  const handleFetch = async () => {
    const response = await fetch(`https://poetrydb.org/random/20`)
    const data = await response.json()
    setPoems(data)
  }

  const addFavs = (favs, index) => {
    setFavs(prev => [...prev, favs])
    console.log(favs)
  }


   // handle input change event
   const handleInputChange = value => {
    setValue(value);
  };
 
  // handle selection
  const handleChange = value => {
    setSelectedValue(value);
  }
 
  // load options using API call
  const loadOptions = (title, author) => {
    return fetch(`https://poetrydb.org/random/20?title=${title}&author=${author}`).then(res => res.json());
  };
  
  const delFav = (index) => {
    let arr = [...favs];
    arr.splice(index, 1)
    setFavs(arr);
  }
  

  return (
    <div>
        <Navbar bg="transparent">
          <Container>
            <Navbar.Brand href="#home">Bejoynd frontend assignment</Navbar.Brand>
          </Container>
        </Navbar>
        <Container>
          <Row>
            <Col></Col>
            <Col xs={6} className="mt-5">
            <h1>Poetry App</h1>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="home" title="Poems">
                  <Button variant="primary" className="mb-3" onClick={handleFetch}>Fetch Poems</Button>
                  {poems.length > 0 && (
                    <Card border="primary" style={{ width: '34rem' }} className="mb-5">
                      {poems.map((poem, index) => (
                        <>
                          <PoemList 
                          key={index} poem={poem} 
                          addFavs={addFavs} delFav={delFav} 
                          index={index} />
                        </>
                      ))}
                      </Card>
                  )}
                </Tab>
                <Tab eventKey="filter" title="Filter">
                  <AsyncSelect
                    className="mb-3"
                    cacheOptions
                    defaultOptions
                    value={selectedValue}
                    getOptionLabel={e => e.title}
                    getOptionValue={e => e.id}
                    loadOptions={loadOptions}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                  />
                  { selectedValue &&
                    <Card border="primary">
                  <Card.Body>
                            <Card.Title>Title</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {selectedValue.title}
                            </Card.Subtitle>
                            <Card.Title>Author</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {selectedValue.author}
                            </Card.Subtitle>
                            <Card.Title style={{color: "blue"}}>.......</Card.Title>
                            <Card.Subtitle className="mb-2" style={{color: "blue"}}>
                              {selectedValue.lines}
                            </Card.Subtitle>
                  </Card.Body>
                  </Card>
                  }
                </Tab>
                <Tab eventKey="favourites" title="Favorites">
                  {favs.length > 0 && (
                    <Card border="primary" style={{ width: '34rem' }} className="mb-5">
                      {favs.map((fav, index) => (
                        <>
                          <FavList key={index} fav={fav} delFav={delFav} index={index}/>
                        </>
                      ))}
                      </Card>
                  )}
                </Tab>
              </Tabs>
            </Col>
            <Col></Col>
          </Row>
        </Container>
    </div>
  )
  
}
export default ListPoems



function PoemList({poem, addFavs, delFav, index}) {
  const [heart, setHeart] = useState(true)


  return (
    <Card.Body>
                            <Card.Title>Title</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {poem.title}
                            </Card.Subtitle>
                            <Card.Title>Author</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {poem.author}
                            </Card.Subtitle>
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={
                                <Popover>
                                  <Popover.Body>
                                  <strong style={{color: "blue"}}>{poem.title}</strong>
                                        <p style={{color: "blue"}}>{poem.author}</p>
                                      <Card.Title style={{color: "blue"}}>.......</Card.Title>
                                    <strong style={{color: "blue"}}>{poem.lines}</strong>
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                            <Card.Link style={{cursor: "pointer", textDecoration: "none"}}>View</Card.Link>
                            </OverlayTrigger>
                            { heart &&
                            <Card.Link className="text-muted" 
                              style={{cursor: "pointer"}} 
                              onClick={() => { setHeart(!heart) }}>
                              <FaHeart onClick={() => addFavs(poem)} size={20} />
                            </Card.Link>
                            }
                            { !heart &&
                            <Card.Link className="text-muted" 
                              style={{cursor: "pointer"}} 
                              onClick={() => { setHeart(!heart) }}>
                              <FaHeart style={{color: "red"}} onClick={() => delFav(index)} size={20} />
                            </Card.Link>
                            }
                            <hr style={{color: "blue"}}/>
                          </Card.Body>
  );
}

const FavList = ({fav, delFav, index}) => {
  return (

    <Card.Body>
            <Card.Title>Title</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                  {fav.title}
              </Card.Subtitle>
              <Card.Title>Author</Card.Title>
               <Card.Subtitle className="mb-2 text-muted">
                  {fav.author}
               </Card.Subtitle>
                <SingleList fav={fav} delFav={delFav} index={index}/>
                            <hr style={{color: "blue"}}/>
                          </Card.Body>
  )
}

const SingleList = ({fav, delFav, index}) => {
  return (
    <>
    <OverlayTrigger
    trigger="click"
    placement="right"
    overlay={
      <Popover>
        <Popover.Body>
        <strong style={{color: "blue"}}>{fav.title}</strong>
        <p style={{color: "blue"}}>{fav.author}</p>
            <Card.Title style={{color: "blue"}}>.......</Card.Title>
          <strong style={{color: "blue"}}>{fav.lines}</strong>
        </Popover.Body>
      </Popover>
    }
  >
  <Card.Link style={{cursor: "pointer", textDecoration: "none"}}>View</Card.Link>
  </OverlayTrigger>
  <Card.Link className="text-muted" style={{cursor: "pointer"}}>
    <FaHeart style={{color: "red"}} onClick={() => {delFav(index)}} size={20} />
  </Card.Link>
  </>
  )
}