import './ProductBox.css'

function ProductBox({ index, value }) {

    const fileId = '1Yz01JFio74Jjq2-W0wJgycAV_ZSsqXMo';  // Replace with your actual file ID
    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    "https://drive.google.com/file/d/1Yz01JFio74Jjq2-W0wJgycAV_ZSsqXMo/view?usp=sharing"

    return (
        <div id='product-box-container'>
            <img src="https://drive.google.com/file/d/1Yz01JFio74Jjq2-W0wJgycAV_ZSsqXMo/view?usp=sharing" alt="img" />
            <div>{value.name}</div>
            <div>{value.category}</div>
            <div>{value.price}</div>
        </div>
    )
}

export default ProductBox