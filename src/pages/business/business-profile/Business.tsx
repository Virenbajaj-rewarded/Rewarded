import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBusiness } from './useBusiness';

import EditIcon from '@/assets/edit.svg?react';
import LocationIcon from '@/assets/location.svg?react';
import TelegramIcon from '@/assets/telegram.svg?react';
import WhatsappIcon from '@/assets/whatsapp.svg?react';
import EmailIcon from '@/assets/email.svg?react';
import PhoneIcon from '@/assets/phone.svg?react';

import { EIndustryDisplayNames, EProgramStrategy } from '@/enums';

const Business = () => {
  const { merchant, isLoading, isError, navigateToEdit } = useBusiness();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError || !merchant) {
    return (
      <div className="space-y-6">
        <p className="text-center text-destructive">
          Failed to load business profile
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <h1 className="text-[38px] font-bold text-foreground">Business</h1>
          <div className="flex flex-row gap-[16px]">
            <Button
              variant="outline"
              onClick={navigateToEdit}
              className="flex items-center justify-center gap-2 border-[none] bg-[#0C1A31] text-[#639CF8] w-full sm:w-[160px]"
            >
              <EditIcon className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#639CF8] flex items-center justify-center flex-shrink-0">
                    {merchant.logoUrl ? (
                      <img
                        src={merchant.logoUrl}
                        alt={merchant.businessName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-[#639CF8] text-2xl font-bold">
                          {merchant.businessName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {merchant.businessName}
                    </h2>
                    <span>
                      {merchant.storeType
                        ? EIndustryDisplayNames[
                            merchant.storeType as keyof typeof EIndustryDisplayNames
                          ]
                        : 'Store'}
                    </span>
                    <p className="text-[#639CF8] text-sm mb-1">
                      {merchant?.activeRewardProgram
                        ? merchant?.activeRewardProgram?.strategy ===
                          EProgramStrategy.PERCENT_BACK
                          ? `${merchant?.activeRewardProgram?.percentBack}% on purchases`
                          : `Spend ${merchant?.activeRewardProgram?.spendThreshold} to earn ${merchant?.activeRewardProgram?.rewardPercent}%`
                        : 'No specific reward program'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {merchant.description && (
              <Card className="bg-[#1A1A1A] border-border">
                <CardContent className="p-6">
                  <p className="text-foreground">
                    {merchant.description || 'No description'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-border">
              <CardContent className="p-6 space-y-4">
                {merchant.businessEmail && (
                  <a
                    href={`mailto:${merchant.businessEmail}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <EmailIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {merchant.businessEmail}
                    </span>
                  </a>
                )}
                {merchant.businessPhoneNumber && (
                  <a
                    href={`tel:${merchant.businessPhoneNumber}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {merchant.businessPhoneNumber}
                    </span>
                  </a>
                )}
                {merchant.location.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <LocationIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {merchant.location.address}
                    </span>
                  </a>
                )}
                {merchant.tgUsername && (
                  <a
                    href={`https://t.me/${merchant.tgUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <TelegramIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {merchant.tgUsername}
                    </span>
                  </a>
                )}
                {merchant.whatsppUsername && (
                  <a
                    href={`https://wa.me/${merchant.whatsppUsername.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <WhatsappIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {merchant.whatsppUsername}
                    </span>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Business;
