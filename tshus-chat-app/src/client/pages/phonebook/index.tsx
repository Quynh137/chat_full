import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8,
};

function App() {
  const [state, setState] = React.useState({
    items: Array.from({ length: 20 }),
  });

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setState({
        items: state.items.concat(Array.from({ length: 20 })),
      });
    }, 1500);
  };

  return (
    <div>
      <h1>demo: react-infinite-scroll-component</h1>
      <hr />
      <div
        id="scrollableDiv"
        style={{
          height: 300,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <InfiniteScroll
          dataLength={state.items.length}
          next={fetchMoreData}
          hasMore={true}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          inverse={true} //
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {state.items.map((i, index) => (
            <div style={style} key={index}>
              div - #{index}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
