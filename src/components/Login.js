import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Login({ socket }) {
    const [teacherId, setTeacherId] = useState('submit');
    const [show, setShow] = useState(false);

    const handleClose = () => {
        console.log(teacherId);
        if (teacherId === 'submit') {
            setShow(false);
        } else if (teacherId !== null) {
            console.log(teacherList);
            const v = teacherList.find((v) => v.userID == teacherId);
            console.log(v);
            // 여기에서 이제 선생님 로그인 코드 작성
            setShow(false);
        }
        socket.emit('enter_room_Assoc', JSON.parse(sessionStorage.getItem('stdInfo')).S_ASSOC, teacherId);
    };
    const handleShow = () => {
        setShow(true);
    };
    function onTeacherChange(e) {
        e.stopPropagation();
        console.log(teacherList);
        console.log(e.target.value);
        setTeacherId(e.target.value);
        // if (e.target.value === 'submit') {
        //     setTeacherName('코알라 선생님');
        //     setTeacherId('submit');
        // } else {
        //     teacherList.map((val) => {
        //         if (e.target.value === val.userID) {
        //             setTeacherName(val.name);
        //             setTeacherId(val.userID);
        //         }
        //     });
        // }
        // console.log(teacherName, teacherId);
    }
    const [error, setError] = useState();
    const [teacherList, setTeacherList] = useState([]);

    const onSubmit = (event) => {
        event.preventDefault();

        axios
            .get(
                sessionStorage.getItem('serverIP') +
                    'student-login-check-assoc/' +
                    event.target[0].value +
                    '/' +
                    event.target[1].value
            )
            .then((v) => {
                if (v.data !== true) {
                    setError('아이디 또는 비밀번호가 잘못되었습니다.');
                } else {
                    axios
                        .get(sessionStorage.getItem('serverIP') + 'get-student-info-assoc/' + event.target[0].value)
                        .then((v) => {
                            sessionStorage.setItem('stdInfo', JSON.stringify(v.data));
                            console.log(v.data.S_ASSOC);
                            socket.emit('get_rooms_assoc', v.data.S_ASSOC);

                            socket.on('rooms', (msg) => {
                                //msg : 선생님 ID 문자열 목록
                                //문자열에서 [,],"을 없애서 ,를 기준으로 teacherList에 저장

                                msg = msg.replace('[', '');
                                msg = msg.replace(']', '');
                                msg = msg.replace(/\"/g, '');
                                msg = msg.split(',');

                                // console.log('100:', msg)
                                var len = msg.length; //msg 배열의 길이
                                let temp = []; //{name : 선생님 이름, ID : 선생님 ID}를 임시로 저장할 배열
                                //선생님 ID -> 선생님 이름으로 바꾸기
                                for (var i = 0; i < len; i++) {
                                    const url2 =
                                        sessionStorage.getItem('serverIP') + 'get-teacher-info-assoc/' + msg[i];
                                    axios({
                                        method: 'get',
                                        url: url2,
                                        headers: {
                                            accept: 'application/json',
                                        },
                                    }).then((result) => {
                                        temp.push({
                                            name: result.data.T_NAME,
                                            userID: result.data.T_ID,
                                        });

                                        setTeacherList([...temp]); //{name : 선생님 이름, ID : 선생님 ID}를 추가
                                    });
                                }

                                console.log();

                                handleShow();
                            });

                            // window.location.replace('/student');
                        });
                }
            })
            .catch(() => {
                setError('알수없는 에러가 발생했어요...');
            });
    };
    return (
        <>
            <div className="center_div" style={{ marginTop: '40px' }}>
                <h1>
                    <img
                        src={
                            'https://www.thecoala.io/_next/image?url=%2Fcoala_logo.png&w=256&q=75&dpl=dpl_CyHC8iRfGhjiFrPP9REiJQ2W2n12'
                        }
                        alt=""
                    />
                </h1>
                <h5>
                    <b>다시 문제를 풀러 가볼까요?</b>
                </h5>
                <br />
                <form onSubmit={onSubmit}>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control idinput"
                            aria-label="아이디"
                            aria-describedby="addon-wrapping"
                            autoFocus
                            required
                            id="id"
                            placeholder="아이디"
                        />
                        <label htmlFor="id">아이디</label>
                    </div>

                    <br />
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control idinput"
                            aria-label="비밀번호"
                            aria-describedby="addon-wrapping"
                            placeholder="비밀번호"
                            required
                            id="password"
                        />
                        <label htmlFor="password">비밀번호</label>
                    </div>
                    <br></br>
                    <label>
                        <input
                            type="radio"
                            value={''}
                            defaultChecked={true}
                            // name={name}
                            // defaultChecked={defaultChecked}
                            // disabled={disabled}
                        />
                        Server 1
                    </label>
                    <br></br>
                    {error}
                    <br />
                    <input type="submit" value="로그인" className="btn btn-info" />
                    <br></br>

                    <br></br>
                </form>
                <img
                    src={
                        'https://www.thecoala.io/_next/image?url=%2Fimages%2FheroPCImage4.png&w=1920&q=75&dpl=dpl_CyHC8iRfGhjiFrPP9REiJQ2W2n12'
                    }
                    style={{ width: '90%', pointerEvents: 'none' }}
                    alt=""
                />
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>선생님 선택하기</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    <select name="teacher" id="teacherList" className="form-select" onChange={onTeacherChange}>
                        <option disabled value={null}>
                            선생님 선택
                        </option>
                        <option value="submit"> 코알라 선생님 </option>
                        {teacherList.map((v) => (
                            <option value={v.userID} key={v.userID}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        수업 입장하기!
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Login;
