import { Table } from "antd";
import styled from 'styled-components';

const ProductTable = ({ products, pagination, onChange, total }) => {
  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price" },
    { title: "Category", dataIndex: "category" },
  ];

  return (
    <Wrap>
      <HeaderRow>
        <h3>Products</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <small style={{ color: '#6b7280' }}>Showing {products.length} items</small>
        </div>
      </HeaderRow>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={pagination}
        onChange={onChange}
      />
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 8px 12px;
`;

const HeaderRow = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom: 12px;
`;

export default ProductTable;
