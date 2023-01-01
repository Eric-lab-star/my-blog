import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import fs from "fs";
import matter from "gray-matter";
export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const cwd = process.cwd();

    try {
      const file = fs.readFileSync(`${cwd}/posts/my_first_post.md`, "utf-8");
      const { data, content } = matter(file);
      await prisma.post.create({
        data: {
          title: data.title,
          content: content,
        },
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json("read file error");
    }
  }
  if (method == "GET") {
    const post = await prisma.post.findUnique({
      where: {
        id: 1,
      },
    });
    if (!post) {
      return res.status(500).json("post not found");
    }
    return res.status(200).json(post);
  }
}
