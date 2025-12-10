#!/bin/bash

# DNS Propagation Checker for grampanchayatwarghat.in
# Check if DNS is propagating correctly for Firebase Hosting

DOMAIN="grampanchayatwarghat.in"
EXPECTED_IP="199.36.158.100"
EXPECTED_TXT="hosting-site=grampanchayat-f0aa7"
EXPECTED_CNAME="grampanchayat-f0aa7.web.app"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DNS Propagation Check - grampanchayatwarghat.in  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Check A Record
echo -e "${BLUE}[1/4] Checking A Record...${NC}"
A_RECORD=$(dig +short $DOMAIN A | head -n1)
if [ "$A_RECORD" == "$EXPECTED_IP" ]; then
    echo -e "${GREEN}✓ A Record: $A_RECORD (Correct!)${NC}"
else
    echo -e "${RED}✗ A Record: $A_RECORD (Expected: $EXPECTED_IP)${NC}"
fi
echo ""

# Check TXT Record
echo -e "${BLUE}[2/4] Checking TXT Record...${NC}"
TXT_RECORD=$(dig +short $DOMAIN TXT | grep -i "hosting-site")
if [[ $TXT_RECORD == *"$EXPECTED_TXT"* ]]; then
    echo -e "${GREEN}✓ TXT Record: $TXT_RECORD (Correct!)${NC}"
else
    echo -e "${RED}✗ TXT Record: $TXT_RECORD (Expected: $EXPECTED_TXT)${NC}"
fi
echo ""

# Check CNAME Record for www
echo -e "${BLUE}[3/4] Checking CNAME Record (www)...${NC}"
CNAME_RECORD=$(dig +short www.$DOMAIN CNAME)
if [[ $CNAME_RECORD == *"$EXPECTED_CNAME"* ]]; then
    echo -e "${GREEN}✓ CNAME Record: $CNAME_RECORD (Correct!)${NC}"
else
    echo -e "${YELLOW}⚠ CNAME Record: $CNAME_RECORD${NC}"
fi
echo ""

# Check if domain is accessible via HTTP
echo -e "${BLUE}[4/4] Checking Domain Accessibility...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L http://$DOMAIN --max-time 10 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "301" ] || [ "$HTTP_STATUS" == "302" ]; then
    echo -e "${GREEN}✓ HTTP Status: $HTTP_STATUS (Accessible!)${NC}"
else
    echo -e "${YELLOW}⚠ HTTP Status: $HTTP_STATUS (Not accessible yet - DNS propagating)${NC}"
fi
echo ""

# Global DNS Check
echo -e "${BLUE}[5/4] Checking Global DNS Propagation...${NC}"
echo -e "${YELLOW}Checking from different DNS servers:${NC}"
echo ""

# Check with Google DNS
echo -n "  Google DNS (8.8.8.8): "
GOOGLE_DNS=$(dig @8.8.8.8 +short $DOMAIN A | head -n1)
if [ "$GOOGLE_DNS" == "$EXPECTED_IP" ]; then
    echo -e "${GREEN}✓ $GOOGLE_DNS${NC}"
else
    echo -e "${RED}✗ $GOOGLE_DNS${NC}"
fi

# Check with Cloudflare DNS
echo -n "  Cloudflare DNS (1.1.1.1): "
CF_DNS=$(dig @1.1.1.1 +short $DOMAIN A | head -n1)
if [ "$CF_DNS" == "$EXPECTED_IP" ]; then
    echo -e "${GREEN}✓ $CF_DNS${NC}"
else
    echo -e "${RED}✗ $CF_DNS${NC}"
fi

# Check with Quad9 DNS
echo -n "  Quad9 DNS (9.9.9.9): "
QUAD9_DNS=$(dig @9.9.9.9 +short $DOMAIN A | head -n1)
if [ "$QUAD9_DNS" == "$EXPECTED_IP" ]; then
    echo -e "${GREEN}✓ $QUAD9_DNS${NC}"
else
    echo -e "${RED}✗ $QUAD9_DNS${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SUMMARY                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$A_RECORD" == "$EXPECTED_IP" ] && [[ $TXT_RECORD == *"$EXPECTED_TXT"* ]]; then
    echo -e "${GREEN}✅ Your DNS configuration is CORRECT!${NC}"
    echo ""
    echo -e "${YELLOW}Status: Waiting for global DNS propagation${NC}"
    echo -e "${YELLOW}Estimated time: 1-6 hours${NC}"
    echo ""
    echo -e "${BLUE}What to do:${NC}"
    echo "  1. Go to Firebase Console"
    echo "  2. Click 'Verify' or 'Continue' button"
    echo "  3. If it fails, wait 30 minutes and try again"
    echo "  4. Firebase will auto-verify once DNS propagates"
    echo ""
    echo -e "${BLUE}Check online:${NC}"
    echo "  https://www.whatsmydns.net/#A/grampanchayatwarghat.in"
else
    echo -e "${RED}⚠ DNS configuration needs attention${NC}"
    echo ""
    echo "Expected:"
    echo "  A:   $EXPECTED_IP"
    echo "  TXT: $EXPECTED_TXT"
    echo ""
    echo "Current:"
    echo "  A:   $A_RECORD"
    echo "  TXT: $TXT_RECORD"
fi

echo ""
echo -e "${BLUE}Run this script again anytime: ./check-dns.sh${NC}"
echo ""
