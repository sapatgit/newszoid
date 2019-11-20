package com.stackroute.registrationservice.service;

import com.stripe.Stripe;
import com.stripe.model.Charge;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class StripeClient {
    private static final Logger logger = LoggerFactory.getLogger(StripeClient.class);

    @Autowired
    StripeClient() {
        Stripe.apiKey = "sk_test_gnCtprCLNNSHjV1VijD3e8TP0036eEsk4v";
    }

    public boolean chargeCreditCard(String token, double amount) throws Exception {
        Charge charge = null;
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", (int)(amount * 10));
        chargeParams.put("currency", "INR");
        chargeParams.put("source", token);
        chargeParams.put("description", "subscription for newsZoid");
        try {
            charge = Charge.create(chargeParams);
            return charge.getPaid();
        }
        catch (Exception e) {
            //e.printStackTrace();
            logger.error(e.toString());
            return false;
        }
    }
}
