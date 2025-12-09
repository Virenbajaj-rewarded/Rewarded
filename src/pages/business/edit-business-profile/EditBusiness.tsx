import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import { EIndustry, EIndustryDisplayNames } from '@/enums';
import { Card } from '@/components/ui/card';
import { useEditBusiness } from './useEditBusiness';
import { FormikProvider } from 'formik';
import { ROUTES } from '@/routes';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building } from 'lucide-react';

const EditBusiness = () => {
  const navigate = useNavigate();
  const {
    formik,
    isLoading,
    isPending,
    handleCancel,
    fileInputRef,
    onPickFile,
    onFileSelected,
    logoPreview,
  } = useEditBusiness();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <div className="space-y-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(ROUTES.BUSINESS)}>
              <ArrowLeftIcon width={24} height={24} />
            </button>
            <h1 className="text-[38px] font-bold text-foreground">
              Edit Business
            </h1>
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-2xl mx-auto gap-4 flex flex-col"
        >
          <Card className="flex flex-col p-6 md:p-[40px] gap-[16px]">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-24 h-24 rounded-full bg-[#639CF8] flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Business logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-12 h-12 text-white" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={onFileSelected}
              />
              <Button
                type="button"
                variant="link"
                onClick={onPickFile}
                className="text-[#639CF8]"
              >
                Change Photo
              </Button>
            </div>

            <Input
              label="Name"
              id="businessName"
              name="businessName"
              placeholder="Enter your business name"
              value={formik.values.businessName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              error={
                formik.touched.businessName && formik.errors.businessName
                  ? formik.errors.businessName
                  : undefined
              }
            />

            <Select
              label="Industry"
              required
              value={formik.values.storeType || ''}
              onValueChange={value => {
                formik.setFieldValue('storeType', value || null);
                formik.setFieldTouched('storeType', true, false);
              }}
              error={
                formik.touched.storeType && formik.errors.storeType
                  ? formik.errors.storeType
                  : undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EIndustry).map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {EIndustryDisplayNames[industry]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Textarea
                label="Description"
                id="description"
                name="description"
                placeholder="Enter your business description"
                value={formik.values.description || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className="resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-red-500">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <Input
              label="Email"
              id="businessEmail"
              name="businessEmail"
              type="email"
              placeholder="Enter your email"
              value={formik.values.businessEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              error={
                formik.touched.businessEmail && formik.errors.businessEmail
                  ? formik.errors.businessEmail
                  : undefined
              }
            />

            <div className="space-y-2">
              <AddressAutocomplete
                label="Address"
                required
                placeholder="Enter your business address"
                value={formik.values.location?.address ?? ''}
                onChange={value => {
                  formik.setFieldValue('location.address', value);
                }}
                onAddressSelect={address => {
                  formik.setFieldValue('location.address', address.address);
                  formik.setFieldValue('location.latitude', address.lat);
                  formik.setFieldValue('location.longitude', address.lng);
                  formik.setFieldTouched('location.address', true);
                }}
                error={
                  formik.touched.location?.address &&
                  formik.errors.location?.address
                }
              />
            </div>

            <Input
              label="Phone Number"
              id="businessPhoneNumber"
              name="businessPhoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formik.values.businessPhoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              error={
                formik.touched.businessPhoneNumber &&
                formik.errors.businessPhoneNumber
                  ? formik.errors.businessPhoneNumber
                  : undefined
              }
            />

            <Input
              label="Telegram"
              id="tgUsername"
              name="tgUsername"
              placeholder="Enter your Telegram username"
              value={formik.values.tgUsername || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.tgUsername && formik.errors.tgUsername
                  ? formik.errors.tgUsername
                  : undefined
              }
            />

            <Input
              label="WhatsApp"
              id="whatsppUsername"
              name="whatsppUsername"
              placeholder="Enter your WhatsApp number"
              value={formik.values.whatsppUsername || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.whatsppUsername && formik.errors.whatsppUsername
                  ? formik.errors.whatsppUsername
                  : undefined
              }
            />

            <div className="flex items-center gap-[16px] pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                className="flex-1 bg-[#639CF8] hover:bg-[#639CF8]/90"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </FormikProvider>
  );
};

export default EditBusiness;
