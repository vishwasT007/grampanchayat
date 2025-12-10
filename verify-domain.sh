#!/bin/bash

# Custom Domain Verification Script
# For grampanchayatwarghat.in

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Domain Setup Verification for grampanchayatwarghat.in   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

DOMAIN="grampanchayatwarghat.in"
WWW_DOMAIN="www.grampanchayatwarghat.in"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking DNS Records..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check A record
echo "1️⃣  Checking A record for $DOMAIN..."
A_RECORD=$(dig +short $DOMAIN A)
if [ "$A_RECORD" == "76.76.21.21" ]; then
    echo -e "${GREEN}✓ A Record configured correctly: $A_RECORD${NC}"
elif [ -z "$A_RECORD" ]; then
    echo -e "${RED}✗ A Record not found${NC}"
    echo "   Please add A record pointing to 76.76.21.21"
else
    echo -e "${YELLOW}⚠ A Record found but incorrect: $A_RECORD${NC}"
    echo "   Should be: 76.76.21.21"
fi
echo ""

# Check CNAME record
echo "2️⃣  Checking CNAME record for $WWW_DOMAIN..."
CNAME_RECORD=$(dig +short $WWW_DOMAIN CNAME)
if [[ "$CNAME_RECORD" == *"vercel"* ]]; then
    echo -e "${GREEN}✓ CNAME Record configured correctly: $CNAME_RECORD${NC}"
elif [ -z "$CNAME_RECORD" ]; then
    echo -e "${RED}✗ CNAME Record not found${NC}"
    echo "   Please add CNAME record pointing to cname.vercel-dns.com"
else
    echo -e "${YELLOW}⚠ CNAME Record found but might be incorrect: $CNAME_RECORD${NC}"
    echo "   Should be: cname.vercel-dns.com"
fi
echo ""

# Check nameservers
echo "3️⃣  Checking Nameservers for $DOMAIN..."
NS_RECORDS=$(dig +short $DOMAIN NS)
if [[ "$NS_RECORDS" == *"vercel"* ]]; then
    echo -e "${GREEN}✓ Using Vercel nameservers${NC}"
    echo "$NS_RECORDS"
else
    echo -e "${YELLOW}⚠ Using custom nameservers (this is OK if you added manual DNS records)${NC}"
    echo "$NS_RECORDS"
fi
echo ""

# Check if domain resolves
echo "4️⃣  Checking if domain is accessible..."
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" -L http://$DOMAIN)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "308" ]; then
    echo -e "${GREEN}✓ Domain is accessible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Domain not accessible (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Check SSL certificate
echo "5️⃣  Checking SSL certificate..."
SSL_CHECK=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | grep "Verify return code:")
if [[ "$SSL_CHECK" == *"0 (ok)"* ]]; then
    echo -e "${GREEN}✓ SSL certificate is valid${NC}"
else
    echo -e "${YELLOW}⚠ SSL certificate not found or invalid${NC}"
    echo "   This is normal if DNS just propagated. Wait a few minutes."
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo ""

# Count checks
PASSED=0
TOTAL=5

if [ "$A_RECORD" == "76.76.21.21" ]; then ((PASSED++)); fi
if [[ "$CNAME_RECORD" == *"vercel"* ]]; then ((PASSED++)); fi
if [[ "$NS_RECORDS" == *"vercel"* ]] || [ ! -z "$A_RECORD" ]; then ((PASSED++)); fi
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "308" ]; then ((PASSED++)); fi
if [[ "$SSL_CHECK" == *"0 (ok)"* ]]; then ((PASSED++)); fi

echo "Checks passed: $PASSED / $TOTAL"
echo ""

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 All checks passed! Your domain is fully configured!${NC}"
    echo ""
    echo "Visit your website at:"
    echo "https://$DOMAIN"
    echo "https://$WWW_DOMAIN"
elif [ $PASSED -ge 3 ]; then
    echo -e "${YELLOW}⚠ Domain is partially configured. Give it more time for DNS to propagate.${NC}"
    echo ""
    echo "What to do:"
    echo "1. Wait 1-4 hours for full DNS propagation"
    echo "2. Run this script again later"
    echo "3. Check: https://www.whatsmydns.net/?d=$DOMAIN&t=A"
else
    echo -e "${RED}✗ Domain is not properly configured yet.${NC}"
    echo ""
    echo "What to do:"
    echo "1. Check your domain registrar DNS settings"
    echo "2. Ensure you added the correct records"
    echo "3. Wait for DNS propagation (1-48 hours)"
    echo "4. See CUSTOM_DOMAIN_SETUP.md for detailed instructions"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Helpful Resources:"
echo ""
echo "• Check DNS propagation: https://www.whatsmydns.net/?d=$DOMAIN&t=A"
echo "• Test SSL certificate: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "• Vercel docs: https://vercel.com/docs/concepts/projects/domains"
echo ""
echo "Need help? Check CUSTOM_DOMAIN_SETUP.md for detailed guide"
echo ""
