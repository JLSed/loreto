# Loreto

A 2D packaging customization and visualization solution. A capstone project of my client.

## Revisions

hello po eto yung ibang details and will provide illustration and wireframing soon

Additional major feature:

To build a recommendation system for apartments and vehicles with a search bar and filter feature, you'll need to implement the following steps:

1. User Input and Preferences: Develop a user interface with a search bar and filter options where users can input their preferences such as location, price range, number of bedrooms (for apartments), type of vehicle, mileage (for vehicles), etc.

2. Recommendation Algorithm: Implement a recommendation algorithm that takes user preferences into account and suggests the most relevant options. This could be based on collaborative filtering, content-based filtering, or a hybrid approach combining both.

3. Search and Filter Functionality: Develop the backend functionality to search and filter through the available apartments and vehicles based on the user's input and preferences.

4. Booking and Availability: Enable users to book apartments and vehicles directly through the platform. Ensure that the system shows real-time availability and updates when an option is booked by another user.

5. Admin Dashboard: Create an admin dashboard where administrators can manage the listings of available apartments and vehicles. This includes adding new listings, modifying existing ones, marking listings as unavailable, updating prices, etc.

6. User Interface: Design a user-friendly interface for both users and administrators, making it easy to navigate, search, filter, and book apartments and vehicles.

Additional minor feature:

Custom box 2D rendering, UI suggested design for more engaging and dynamic interaction:

- must have an X and Y axis platform along with ruler for accurate sizing.
- it should work well both in pc and mobile browser.
- zoon in and out feauture
- dark model

Feedback Mechanism: Implement a feedback mechanism where users can rate and review custom box product and services, apartments rent, and vehicles services they've booked, helping to improve the recommendation system over time.

Client details

Contact Imformation:

Phone: (0965) 193 7830
Telphone: (02) 8442 8560
Email: loretotrading@gmail.com (not final yet, will create soon)

Location: B2 L19 Camis St. Golden Acres Subd. Las Piñas City 1747

Client property size and 2 vehicle, list details (will provide soon)

must provide:

Family use apartment rentals (Non-Commercial Use):

size details with 2D image, type (2 floor and 1 floor with balcony), min-max capacity, Monthly rate & Downpayment amount, other details.

vehicle:

size details with 2D image, type (L300 van car, and truck for transporing geavy goods).

person: min-max capacity (that can fit in)
item: min- max capacity weight (kg)

Rate per weight and per head

both for custom, vehicle and apartment payment option and requirement: total view of amount, status, and tracking details

- Downpayment
- proof of identity
- note and other details.


### Uploading Logic to Prevent Image Bloat up

```
// if the photo changed, upload the new photo to cloudinary
// if the photo is a string, it means the photo was not changed
// if the upload is successful, update the vehicle with the new photo url
// save the vehicle to the database with the new photo url
// if saved successfully, delete the old photo from cloudinary
// else delte the new uploaded photo from cloudinary
```
