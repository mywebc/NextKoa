// 在next中使用HOC要注意，返回的组件是没有getInitialProps这个方法的
export default (Com) => {
    return function TestCom(props){
        return <Com {...props}/>
    }
}