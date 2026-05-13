import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle, XCircle, Clock, Package, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds | Rathore Brand",
  description: "Learn about our hassle-free return and refund policy. 7-day easy returns on all products.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer hassle-free returns within 7 days of delivery. Shop with confidence 
            knowing that we&apos;ve got you covered.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Return Policy Highlights */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">7-Day Returns</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Return any product within 7 days of delivery for a full refund
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Easy Pickup</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  We arrange free pickup from your doorstep for all returns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Full Refund</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  100% refund to your original payment method within 5-7 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Return Process */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6">How to Return</h2>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    1
                  </div>
                  <h4 className="font-medium mb-2">Initiate Return</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to your orders and click &quot;Return&quot; within 7 days
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    2
                  </div>
                  <h4 className="font-medium mb-2">Pack Item</h4>
                  <p className="text-sm text-muted-foreground">
                    Pack the product in original packaging with all tags
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    3
                  </div>
                  <h4 className="font-medium mb-2">Pickup</h4>
                  <p className="text-sm text-muted-foreground">
                    Our courier partner will pick up from your address
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    4
                  </div>
                  <h4 className="font-medium mb-2">Refund</h4>
                  <p className="text-sm text-muted-foreground">
                    Refund processed within 5-7 days after quality check
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible & Non-Eligible Items */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Eligible for Return
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Unused products with original tags
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Defective or damaged products
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Wrong product delivered
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Size/fit issues (for apparel)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Products not as described
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not Eligible for Return
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Products used or washed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Items without original packaging
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Innerwear and socks (hygiene reasons)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Products with removed tags
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Returns initiated after 7 days
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Refund Information */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Refund Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Refund Timeline</h4>
                  <p className="text-muted-foreground">
                    Once we receive and inspect your return, we will process your refund within 
                    24-48 hours. The refund will be credited to your original payment method 
                    within 5-7 business days.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Refund Methods</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Credit/Debit Card: 5-7 business days</li>
                    <li>• UPI: 2-3 business days</li>
                    <li>• Wallet: Instant refund to store credit</li>
                    <li>• COD Orders: Bank transfer or store credit</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Exchange Policy</h4>
                  <p className="text-muted-foreground">
                    We currently do not offer direct exchanges. Please return the unwanted item 
                    for a refund and place a new order for the desired product.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Start a Return
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Need help? Contact our support team at support@rathorebrand.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
