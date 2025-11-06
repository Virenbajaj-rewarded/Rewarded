import { OffersManager } from '@/components/offers/OffersManager';

const Offers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Send Offers</h1>
        <p className="text-muted-foreground mt-2">
          Create and send targeted offers to your customers
        </p>
      </div>

      <OffersManager />
    </div>
  );
};

export default Offers;
