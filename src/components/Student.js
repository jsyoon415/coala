function Student() {
    if (sessionStorage.getItem('stdInfo') == null) {
        window.location.replace('/');
    }
    const stdInfo = JSON.parse(sessionStorage.getItem('stdInfo'));
    console.log(stdInfo);
    return <></>;
}
export default Student;
