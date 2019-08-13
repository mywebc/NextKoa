// function Test({count}){
//     // console.log("prosp",props)
//     return (
//         <span>
//             {/* <span>{props._v.count}</span> */}
//             <span>test</span>
//             <span>{count}</span>
//         </span>
//     )
// }
// Test.getInitialProps = async () => {
//     return {
//         count: "12333"
//     }
// }
// export default Test

class Test extends React.Component {
    static async getInitialProps() {
        return { count: 'hehe' };
    }
    render() {
        console.log("test props", this.props)
        return (
            <span>
                 <span>test</span>
                <span>{this.props.count}</span>
             </span> 
        )
    }
    
}


export default Test
