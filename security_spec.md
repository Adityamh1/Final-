# Security Specification - Maharashtra Pashubazaar

## 1. Data Invariants
- **Listing Ownership**: A Listing can only be created if the `deviceId` matches the authenticated user's UID (`request.auth.uid`).
- **Listing Updates/Deletions**: Only the creator of the listing (matching `existing().deviceId == request.auth.uid`) or an Admin can update or delete a listing.
- **Value Constraints**:
  - `price` must be a non-negative number (`>= 0`).
  - Required fields (`category`, `breed`, `price`, `age`, `location`, `district`, `sellerName`, `phone`, `details`, `createdAt`, `createdAtTime`) must always be present.
  - Length bounds on string fields must be strictly enforced:
    - `breed` <= 100 chars
    - `age` <= 50 chars
    - `location` <= 150 chars
    - `district` <= 50 chars
    - `photo` <= 1,000,000 chars (Base64 encoding/URL)
    - `sellerName` <= 100 chars
    - `phone` <= 15 chars
    - `details` <= 2000 chars
    - `milkCapacity` <= 50 chars
    - `gender` <= 20 chars
    - `createdAt` <= 50 chars
    - `deviceId` <= 128 chars

---

## 2. The "Dirty Dozen" Payloads (Designed to Break Security)

### Payload 1: Identity Spoofing (Create with Foreign DeviceId)
**Intent**: Bypass ownership matching by setting another user's UID.
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "hacker-user-uid" // Doesn't match request.auth.uid
}
```

### Payload 2: Identity Spoofing (Update of Someone Else's Listing)
**Intent**: Modify a listing created by someone else.
```json
// Existing listing has deviceId: "original-user-uid"
// Incoming request tries to update price or details:
{
  "price": 100 // Target listing owned by another user is modified by "hacker"
}
```

### Payload 3: Shadow Update / Ghost Fields
**Intent**: Introduce undocumented fields into the document structure to pollute the schema.
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid",
  "adminStatus": "approved", // Ghost field
  "hacked": true             // Ghost field
}
```

### Payload 4: Type Tampering on Core Field (Category is boolean)
**Intent**: Pass boolean value instead of a valid category string.
```json
{
  "category": true, // Type mismatch
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid"
}
```

### Payload 5: Volumetric Exhaustion (Details Field > 2000 chars)
**Intent**: Inject a massive string to consume storage/bandwidth (Denial of Wallet).
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "A".repeat(5000), // Exceeds maxLength of 2000
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid"
}
```

### Payload 6: Volumetric Exhaustion (Breed Field > 100 chars)
**Intent**: Inject an oversized breed name.
```json
{
  "category": "cow",
  "breed": "Holstein-Friesian-Crossbreed-Super-Milker-Extraordinaire-Very-Long-Breed-Name-That-Exceeds-Limits-Definitely", 
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid"
}
```

### Payload 7: Integrity Breach (Negative Price)
**Intent**: Create a listing with negative pricing.
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": -100, // Invalid negative value
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid"
}
```

### Payload 8: Value Poisoning (Invalid Type in Optional Field)
**Intent**: Pass an invalid type in the optional field `hidePhone`.
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid",
  "hidePhone": "No" // Should be a boolean, not string
}
```

### Payload 9: Missing Required Fields
**Intent**: Create a listing missing mandatory fields (e.g., missing sellerName).
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid"
  // sellerName is missing!
}
```

### Payload 10: ID Poisoning (Malicious Path Variable Injection)
**Intent**: Create a listing with a huge or malformed document ID to disrupt database queries.
```json
// Targeted Document Path: /listings/malicious-ID_containing_symbols_and_being_extremely_long_over_128_characters_$$$$
```

### Payload 11: Unauthorized Promotion (isPremium Spoofing)
**Intent**: A regular user tries to set their listing as premium without admin rights or paywall clearance.
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": 1784419200000,
  "deviceId": "request-auth-uid",
  "isPremium": true // Should only be editable by admins or authorized flows
}
```

### Payload 12: Invalid Timestamp (createdAtTime is not number)
**Intent**: Pass an invalid data type for time to disrupt chronological sorting.
```json
{
  "category": "cow",
  "breed": "Gir",
  "price": 45000,
  "age": "2 years",
  "location": "Pune",
  "district": "Pune",
  "photo": "https://image.url",
  "sellerName": "Ramesh",
  "phone": "9876543210",
  "details": "Healthy Gir cow.",
  "createdAt": "19-07-2026",
  "createdAtTime": "now", // Type mismatch, should be a number
  "deviceId": "request-auth-uid"
}
```

---

## 3. The Test Runner

The tests are modeled below. During our audit, each payload must produce a `PERMISSION_DENIED` error when processed with non-complying identities or shapes.
