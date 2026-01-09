import React, { useEffect, useState, useRef } from "react";
import { DatePicker, Input, Select, Button, Modal, Form, Switch } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';

dayjs.extend(isBetween);
const axiosInstance = axios.create({ baseURL: "http://localhost:3000/api" });

const DEFAULT_PAGE_SIZE = 10; 

const Page1 = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // default to last 7 days: start = 7 days ago, end = today
  const defaultStart = dayjs().subtract(7, "day");
  const defaultEnd = dayjs();

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // When true, ignore date filtering and show all products
  const [showAllDates, setShowAllDates] = useState(false);

  // track initial mount to prevent duplicate initial fetches
  const mountedRef = useRef(false);

  const handleToggleAllDates = (checked) => {
    setShowAllDates(checked);
    if (checked) {
      setStartDate(null);
      setEndDate(null);
    } else {
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
    }
    // rely on the effect below to refresh the list after toggle
  }; 

  const fetchProducts = async (page = currentPage - 1, size = pageSize) => {
    try {
      let res;
      const pageParam = `page=${page}&size=${size}`;

      if (search) {
        res = await axiosInstance.get(`/products/search?keyword=${encodeURIComponent(search)}&${pageParam}`);
      } else {
        res = await axiosInstance.get(`/products?${pageParam}`);
      }

      const data = res.data || {};
      // support both non-paged (array) and paged responses
      let fetched = Array.isArray(data) ? data : (data.content || []);
      const totalElements = data.totalElements != null ? data.totalElements : fetched.length;
      const current = data.number != null ? data.number + 1 : page + 1;

      // apply category filter client-side if set
      if (filter) {
        fetched = fetched.filter((p) => (p.category || "").toLowerCase() === filter.toLowerCase());
      }

      // apply date range filter if createdDate present
      const start = startDate ? startDate.startOf('day') : null;
      const end = endDate ? endDate.endOf('day') : null;
      const withinDate = (p) => {
        if (!p.createdDate || !start || !end) return true;
        const d = dayjs(p.createdDate);
        if (!d.isValid()) return true;
        return d.isBetween(start, end, null, '[]');
      };
      fetched = fetched.filter(withinDate);

      setProducts(fetched);
      setTotal(totalElements);
      setCurrentPage(current);
      setPageSize(size);

      return fetched;
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
      setTotal(0);
      return [];
    }
  }; 

  useEffect(() => {
    (async () => {
      await fetchProducts(0, pageSize);
      await fetchCategories();
      mountedRef.current = true;
    })();
  }, []);

  // refresh table automatically when filters change after initial load
  useEffect(() => {
    if (!mountedRef.current) return;
    // reset to first page when filters change
    fetchProducts(0, pageSize);
  }, [search, filter, startDate, endDate, showAllDates]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/products/categories');
      const cats = Array.isArray(res.data) ? res.data : [];
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    if (location?.state?.newProduct) {
      (async () => {
        console.debug("Page1: received navigation state", location.state);

        const incoming = { ...location.state.newProduct };

        if (!incoming.id) incoming.id = `local-${Date.now()}`;

        const latest = await fetchProducts(0, pageSize);

        if (!latest.some((p) => p && p.id === incoming.id)) {
          setProducts([incoming, ...latest]);
        } else {
          setProducts(latest);
        }

        const { pathname, search, hash } = window.location;
        window.history.replaceState({}, document.title, pathname + (search || "") + (hash || ""));
      })();
    }
  }, [location]);

  const handleTableChange = (pagination) => {
    const { current = 1, pageSize: ps = DEFAULT_PAGE_SIZE } = pagination || {};
    fetchProducts(current - 1, ps);
  }; 

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      setIsModalOpen(false);
      form.resetFields();

      // ensure price is a number and add createdDate
      const payload = {
        ...values,
        price: Number(values.price),
        description: values.description || "",
        brand: values.brand || "",
        createdDate: new Date().toISOString(),
      };

      navigate("/confirm", { state: payload });
    });
  };

  return (
    <Container>
      <Hero className="hero">
        <HeroTitle>Product Management</HeroTitle>
      </Hero>

      <TopBar>
        <Title>Product Filters</Title>
        <Actions>
          <Control>
            <Label>Start</Label>
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
              disabled={showAllDates}
              disabledDate={(d) => (endDate ? d > endDate : false)}
              allowClear
            />
          </Control>

          <Control>
            <Label>End</Label>
            <DatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              disabled={showAllDates}
              disabledDate={(d) => (startDate ? d < startDate : false)}
              allowClear
            />
          </Control>

          <ToggleWrap>
            <Switch checked={showAllDates} onChange={handleToggleAllDates} />
            <small style={{ marginLeft: 8 }}>Show all dates</small>
          </ToggleWrap>

          <SearchWrap>
            <Input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrap>

          <Control>
            <Select
              placeholder="Filter by category"
              style={{ width: 200 }}
              onChange={setFilter}
              allowClear
              options={categories.map((c) => ({ label: c, value: c }))}
            />
          </Control>

          <Button type="dashed" onClick={() => setIsModalOpen(true)}>
            Add New Product
          </Button>
        </Actions>
      </TopBar>

      <TableWrap>
        <ProductTable
          products={products}
          total={total}
          pagination={{ current: currentPage, pageSize, total }}
          onChange={handleTableChange}
        />
      </TableWrap>

      {/* Modal Form */}
      <Modal
        title="Enter Product Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleModalSubmit}
      >
        <Form form={form} layout="vertical">
              <Form.Item name="title" label="Product Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="brand" label="Brand">
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};


const Container = styled.div`
  max-width: 1100px;
  margin: 24px auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  background: ${(p) => p.theme.colors.card};
  padding: 18px;
  border-radius: ${(p) => p.theme.radius};
  box-shadow: 0 8px 28px rgba(11, 22, 50, 0.06);
  border: 1px solid rgba(16,24,40,0.04);
  flex-wrap: wrap;
`;

const Title = styled.h2`
  margin: 0;
  padding-right: 16px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const Control = styled.div`
  display:flex;
  flex-direction: column;
  gap:6px;
`;

const Label = styled.small`
  color: ${(p) => p.theme.colors.muted};
`;

const ToggleWrap = styled.div`
  display:flex;
  align-items:center;
`;

const SearchWrap = styled.div`
  min-width: 250px;
`;

const TableWrap = styled.div`
  margin-top: ${(p) => p.theme.spacing.md};
  background: ${(p) => p.theme.colors.card};
  padding: 12px;
  border-radius: ${(p) => p.theme.radius};
`;

const Hero = styled.div`
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  margin: 0 0 6px 0;
  font-size: 22px;
  color: ${(p) => p.theme.colors.primary};
`;

const HeroSubtitle = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.muted};
`;

export default Page1;
