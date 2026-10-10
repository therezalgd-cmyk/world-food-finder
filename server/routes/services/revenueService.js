function calculateRestaurantRevenue(data){
  // units are illustrative and in BDT
  return {
    listingFee: data.listing ? 200 : 0,
    featuredFee: data.featured ? 500 : 0,
    boostFee: (data.boost || 0) * 100,
    adsRevenue: (data.adClicks || 0) * 2,
    total: (data.listing ? 200 : 0) + (data.featured ? 500 : 0) + ((data.boost || 0) * 100) + ((data.adClicks || 0) * 2)
  };
}

module.exports = { calculateRestaurantRevenue };
