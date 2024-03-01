import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Split from '@uiw/react-split';

function ProblemViewer() {
    let serverIP = sessionStorage.getItem('serverIP');
    const [url, setUrl] = useState(
        'https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm_link/1001.html'
    );
    const [id, setId] = useState(1001);
    const inputRef = useRef();
    useEffect(() => {
        setInit(true);
        // axios
        //     .get(serverIP + `get-problem-url/${id}`)
        //     .then((res) => {
        //         if (res.data === "Error:'NoneType' object is not subscriptable") {
        //             return alert('문제를 찾을수 없어요.');
        //         }

        //         setUrl(res.data);
        //         setInit(true);
        //     })
        //     .catch((e) => {
        //         console.log(e);
        //     });
    }, []);
    // useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.value = 1001;
    //     }
    // }, [Side]);
    // const OnChange = (event) => {
    //     event.target.focus();

    //     setId(event.target.value);
    // };
    const OnSubmit = (event) => {
        event.preventDefault();

        axios
            .get(serverIP + `get-problem-url/${inputRef.current.value}`)
            .then((res) => {
                if (res.data === "Error:'NoneType' object is not subscriptable") {
                    return alert('문제를 찾을수 없어요.\n' + res.data);
                }
                setId(inputRef.current.value);
                setUrl(res.data);
                setInit(true);
            })
            .catch((e) => {
                alert(e.message);
            });
    };
    const [init, setInit] = useState(false);
    function View() {
        return <iframe src={url} title="Problem" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>;
    }
    function Side() {
        return (
            <div style={{ marginLeft: '10px', marginTop: '10px' }}>
                <h3>{id}번 문제</h3>
                <form>
                    <div className="problemInput-wrap">
                        <div className="form-floating">
                            <input
                                type="number"
                                className="form-control problemInput"
                                aria-label="문제 아이디"
                                aria-describedby="addon-wrapping"
                                placeholder="문제 아이디"
                                required
                                id="password"
                                min={1001}
                                style={{ float: 'left', marginRight: 20 }}
                                ref={inputRef}
                            />
                            <label htmlFor="password">문제 아이디</label>
                            <button
                                type="submit"
                                className="btn btn-success"
                                style={{ marginTop: 10 }}
                                onClick={OnSubmit}
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
    return (
        <>
            {init ? (
                <>
                    <Split style={{ height: '100vh', border: '1px solid #d5d5d5', borderRadius: 3 }}>
                        <div style={{ minWidth: 300 }}>
                            <View />
                        </div>
                        <div style={{ minWidth: 150, flex: 1 }}>
                            <Side />
                        </div>
                    </Split>
                </>
            ) : (
                <>로딩중...</>
            )}
        </>
    );
}

export default ProblemViewer;
