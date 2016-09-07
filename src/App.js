import React, { Component } from 'react';
import './App.css';

const NEWS_PER_PAGE = 30;

const StoryItem = ({ item }) => {
  let content = 'Fetching ...';
  if(item && !item.isFetching){
    content = (
      <p>
        <a href={item.url} target="_blank">
          {item.title}
        </a>
        {item.url &&
          <span className="story-item-host">({new URL(item.url).host})</span>}
        <br/>
        <span className="story-item-score">
          {item.score} points by <b>{item.by} </b>
        </span>
        <span className="story-item-time">
          | {new Date(item.time).toLocaleTimeString()}
        </span>
        <span className="story-item-comments">
          | {(item.kids && item.kids.length) || 0} comments
        </span>
      </p>
    );
  }
  return (
    <li className="story-item">
      {content}
    </li>
  );
}

const Pagination = ({ currentPage, goToPage }) => {
  return (
    <div>
      {currentPage > 0 && <button onClick={() => goToPage(currentPage-1)}>
        Previous
      </button>}
      <button onClick={() => goToPage(currentPage+1)}>
        Next
      </button>
    </div>
  )
}

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      storiesIds: [],
      loadedStories: {},
      page: 0,
      isFetching: false
    };
  }

  componentDidMount(){
    this.setState({
      isFetching: true
    });
    this.fetchTopStories()
      .then( ids => this.fetchTopStoriesSuccess(ids));
  }

  fetchTopStories(){
    let url = "https://hacker-news.firebaseio.com/v0/topstories.json";
    return fetch(url)
      .then( response => response.json());
  }

  fetchItem(id){
    let url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    return fetch(url)
      .then( response => response.json())
  }

  fetchTopStoriesSuccess(ids){
    this.setState({
      storiesIds: ids,
      isFetching: false
    });
    this.fetchPage(this.state.page);
  }

  fetchItemSuccess(item){
    let { loadedStories } = this.state;
    this.setState({
      loadedStories: {
        ...loadedStories,
        [item.id]: item
      }
    });
  }

  currentStoriesPerPage(page) {
    let { storiesIds } = this.state;
    if(storiesIds.length > 0){
      return storiesIds.slice(page*NEWS_PER_PAGE, (page+1)*NEWS_PER_PAGE);
    }
    return [];
  }

  fetchPage(page){
    let { loadedStories } = this.state;
    let currentStories = this.currentStoriesPerPage(page);
    for(let id of currentStories){
      if(!loadedStories[id]){
        loadedStories[id] = {
          isFetching: true
        };
        this.fetchItem(id)
          .then( item => this.fetchItemSuccess(item));
      }
    }
    this.setState({
      loadedStories: { ...loadedStories }
    });
  }

  goToPage(page) {
    this.fetchPage(page);
    this.setState({
      page
    });
  }

  render() {
    let { page, loadedStories, isFetching } = this.state;
    let currentStories = this.currentStoriesPerPage(page);
    let start = (page*NEWS_PER_PAGE)+1;
    return (
      <div className="App">
        <div className="App-header">
          <h2>React Hacker News</h2>
        </div>
        <div className="App-container">

          {isFetching && <h2>Fetching Top Stories ... </h2>}

          <ol start={start}>
            {currentStories.map( id => {
              let item = loadedStories[id];
              return <StoryItem item={item} key={id}/>;
            })}
          </ol>

          <Pagination currentPage={page} goToPage={(page) => this.goToPage(page)}/>
        </div>
      </div>
    );
  }
}

export default App;
