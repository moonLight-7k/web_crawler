# Web Miner

## Overview

The Web Miner is a versatile JavaScript tool designed to fetch data from websites based on user-specified HTML tags. Users can customize the crawler to target specific tags, ensuring precise extraction of relevant content.

## Key Features

- **Tag Customization:** Users can specify HTML or XML tags, tailoring the crawler to their unique data extraction needs.

- **Data Precision:** By focusing on specific tags, the crawler extracts only the content that matters most to the user.

- **Ease of Use:** With a user-friendly interface, the crawler allows for easy input of desired tags.

## How It Works

1. **Tag Specification:**

   - Users input the HTML or XML tags they want the crawler to target within its configuration.

2. **Data Crawling:**

   - The crawler navigates the provided URL(s) and scans the web page source code for the specified tags.

3. **Data Extraction:**

   - Upon locating the specified tags, the crawler extracts the associated content, providing users with the desired data.

4. **Output Options:**
   - Users can choose to export the extracted data in various formats, such as JSON or CSV, for seamless integration with other tools or analysis.

## Getting Started

### Installation
#### Clone the repo:
(Note: [Node.js](https://nodejs.org/en) should be installed )

````bash
git clone https://github.com/moonLight-7k/web_crawler.git
````

#### Usage

##### to crawl the site
````bash
node main.js <website>
````

##### to see help
````bash
node main.js help
````
