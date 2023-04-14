const Bull = require("bull");
const axios = require("axios");

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

class ReviewTestBullQueue {
  queue;
  constructor() {
    // initialize queue
    this.queue = new Bull("review-queue", {
      redis: {
        host,
        port: Number(port),
        password,
      },
    });

    // add a worker
    this.queue.process(async (job) => {
      try {
        const id = job.data.id;
        const data = {
          reviewTestId: id,
        };

        axios
          .post("http://localhost:3000/api/v1/webhook/review-test", data)
          .then((res) => {
            console.log(`statusCode: ${res.status}`);
            console.log(JSON.stringify(res.data.data.reviewTest));
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.log("process error: ", error);
        return { error: "process error: " };
      }
    });
  }

  async addReviewQueue(data) {
    try {
      const time = new Date(data.time).getTime();
      // If time < now => no delay
      const delay = time - Date.now() > 0 ? time - Date.now() : 1;

      const jobId = data.id;

      await this.queue.add(data, {
        // removeOnComplete: true,
        // removeOnFail: true,
        // backoff: 3,
        // attempts: 3,
        // Delay time: time - current time
        delay: 1000,
        // jobId: _id/state
        jobId,
      });
      return jobId;
    } catch (error) {
      console.log("addCampaignToQueue error: ", error);
      return { error: "addCampaignToQueue error: " };
    }
  }

  async getJobById(id) {
    try {
      const job = await this.queue.getJob(id);
      return job;
    } catch (error) {
      console.log("getJobById error: ", error);
      return { error: "getJobById error: " };
    }
  }

  async deleteJobById(id) {
    const job = await this.getJobById(id);
    await job.remove();

    return job;
  }
}

module.exports = ReviewTestBullQueue;
