import React, { useState } from "react";
import { Card, Button, message, Input, InputNumber } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';

const axiosInstance = axios.create({ baseURL: "http://localhost:3000/api" });

const Page2 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(state || {});

  if (!state) {
    return <h3>No product details provided.</h3>;
  }

  const handleFieldChange = (field, value) => {
    setFormState((s) => ({ ...s, [field]: value }));
  };

  const handleConfirm = async () => {
    try {
      // use the edited values if in edit mode, otherwise original state
      const payload = {
        ...(isEditing ? formState : state),
        price: Number(isEditing ? formState.price : state.price) || 0,
        createdDate: (isEditing ? formState.createdDate : state.createdDate) || new Date().toISOString(),
      };

      const res = await axiosInstance.post("/products", payload);
      message.success("Product Created Successfully!");

      const newProduct = { ...payload, ...(res && res.data ? res.data : {}) };
      if (!newProduct.id) newProduct.id = `local-${Date.now()}`;

      console.debug("Page2: created product, navigating back with", newProduct);

      navigate("/", { state: { newProduct } });
    } catch (err) {
      console.error(err);
      message.error("Failed to create product!");
    }
  };

  const startEditing = () => {
    setFormState({ ...state });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormState({ ...state });
    setIsEditing(false);
  };

  return (
    <ConfirmWrap>
      <div>
        <h2>Confirm Product Details</h2>

        <Card style={{ width: 600 }}>
          <CardHeader>Review & Confirm</CardHeader>

          {!isEditing ? (
            <>
              <InfoRow><strong>Title:</strong> {state.title}</InfoRow>
              <InfoRow><strong>Description:</strong> {state.description}</InfoRow>
              <InfoRow><strong>Brand:</strong> {state.brand}</InfoRow>
              <InfoRow><strong>Price:</strong> {state.price}</InfoRow>
              <InfoRow><strong>Category:</strong> {state.category}</InfoRow>
              <InfoRow><strong>Created:</strong> {state.createdDate}</InfoRow>
            </>
          ) : (
            <>
              <InfoRow>
                <strong>Title:</strong>
                <div style={{ marginTop: 6 }}>
                  <Input value={formState.title} onChange={(e) => handleFieldChange('title', e.target.value)} />
                </div>
              </InfoRow>

              <InfoRow>
                <strong>Description:</strong>
                <div style={{ marginTop: 6 }}>
                  <Input.TextArea value={formState.description} onChange={(e) => handleFieldChange('description', e.target.value)} rows={3} />
                </div>
              </InfoRow>

              <InfoRow>
                <strong>Brand:</strong>
                <div style={{ marginTop: 6 }}>
                  <Input value={formState.brand} onChange={(e) => handleFieldChange('brand', e.target.value)} />
                </div>
              </InfoRow>

              <InfoRow>
                <strong>Price:</strong>
                <div style={{ marginTop: 6 }}>
                  <InputNumber value={formState.price} onChange={(v) => handleFieldChange('price', v)} style={{ width: '100%' }} />
                </div>
              </InfoRow>

              <InfoRow>
                <strong>Category:</strong>
                <div style={{ marginTop: 6 }}>
                  <Input value={formState.category} onChange={(e) => handleFieldChange('category', e.target.value)} />
                </div>
              </InfoRow>

            </>
          )}

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleConfirm} style={{ marginRight: 10 }}>
              Confirm
            </Button>

            {!isEditing ? (
              <Button onClick={startEditing} style={{ marginRight: 10 }}>Edit</Button>
            ) : (
              <Button onClick={cancelEditing} style={{ marginRight: 10 }}>Cancel Edit</Button>
            )}

            <Button onClick={() => navigate(-1)}>Back</Button>
          </div>
        </Card>
      </div>
    </ConfirmWrap>
  );
};

const ConfirmWrap = styled.div`
  padding: 40px;
  display:flex;
  justify-content:center;
  align-items:flex-start;
`;

const CardHeader = styled.div`
  font-weight: 700;
  padding: 12px 0;
  border-bottom: 1px solid rgba(16,24,40,0.04);
  color: ${(p) => p.theme.colors.primary};
`;

const InfoRow = styled.p`
  margin:6px 0;
  color: ${(p) => p.theme.colors.text};
`;

export default Page2;
