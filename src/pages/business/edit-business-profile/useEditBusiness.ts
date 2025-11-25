import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/services/merchant/useMerchant';
import { editBusinessValidationSchema } from './EditBusiness.validation';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { IUpdateMerchantPayload } from '@/services/merchant/merchant.types';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const useEditBusiness = () => {
  const navigate = useNavigate();
  const { useFetchMerchantProfileQuery, useUpdateMerchantMutation } =
    useMerchant();
  const { data: merchant, isLoading } = useFetchMerchantProfileQuery();
  const { mutate: updateMerchant, isPending } = useUpdateMerchantMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleUpdateBusiness = (values: IUpdateMerchantPayload) => {
    try {
      updateMerchant(values);
      navigate(-1);
    } catch (error) {
      console.error('Failed to update business:', error);
    }
  };

  const formik = useFormik<IUpdateMerchantPayload>({
    initialValues: {
      businessName: merchant?.businessName || '',
      storeType: merchant?.storeType || null,
      description: merchant?.description || '',
      businessEmail: merchant?.businessEmail || '',
      businessPhoneNumber: merchant?.businessPhoneNumber || '',
      location: {
        address: merchant?.location?.address || '',
        latitude: merchant?.location?.latitude || 0,
        longitude: merchant?.location?.longitude || 0,
      },
      tgUsername: merchant?.tgUsername || '',
      whatsppUsername: merchant?.whatsppUsername || '',
    },
    enableReinitialize: true,
    validationSchema: editBusinessValidationSchema,
    onSubmit: handleUpdateBusiness,
  });

  const handleCancel = () => {
    formik.resetForm();
    navigate(-1);
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG/JPG).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Max size is 5MB.');
      return;
    }

    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<{ logoUrl: string }>(
        '/merchants/upload-logo',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setLogoPreview(data.logoUrl);
      toast.success('Your business logo was uploaded successfully.');
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Could not upload your logo. Please try again.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return {
    formik,
    isLoading,
    isPending,
    merchant,
    handleCancel,
    fileInputRef,
    onPickFile,
    onFileSelected,
    logoPreview: logoPreview || merchant?.logoUrl || null,
  };
};
